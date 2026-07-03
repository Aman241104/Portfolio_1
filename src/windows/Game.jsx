import { useEffect, useRef, useState, useCallback } from "react";
import WindowWrapper from "#hoc/WindowWrapper.jsx";
import { WindowControls } from "#components";

const GRID = 18;
const CELL = 20;
const SPEED_MS = 110;

const randomCell = (exclude) => {
    let cell;
    do {
        cell = {
            x: Math.floor(Math.random() * GRID),
            y: Math.floor(Math.random() * GRID),
        };
    } while (exclude.some((c) => c.x === cell.x && c.y === cell.y));
    return cell;
};

const Game = ({ embedded = false } = {}) => {
    const canvasRef = useRef(null);
    const dirRef = useRef({ x: 1, y: 0 });
    const nextDirRef = useRef({ x: 1, y: 0 });
    const snakeRef = useRef([{ x: 8, y: 9 }]);
    const foodRef = useRef({ x: 12, y: 9 });

    const [score, setScore] = useState(0);
    const [best, setBest] = useState(() => Number(localStorage.getItem("snake_best") || 0));
    const [gameOver, setGameOver] = useState(false);
    const [running, setRunning] = useState(false);

    const resetGame = useCallback(() => {
        snakeRef.current = [{ x: 8, y: 9 }];
        dirRef.current = { x: 1, y: 0 };
        nextDirRef.current = { x: 1, y: 0 };
        foodRef.current = randomCell(snakeRef.current);
        setScore(0);
        setGameOver(false);
        setRunning(true);
    }, []);

    const trySetDirection = useCallback((next) => {
        const d = dirRef.current;
        // can't reverse directly into yourself
        if (next.x === -d.x && next.y === -d.y) return;
        nextDirRef.current = next;
    }, []);

    // Keyboard controls
    useEffect(() => {
        const onKeyDown = (e) => {
            const map = {
                ArrowUp: { x: 0, y: -1 },
                ArrowDown: { x: 0, y: 1 },
                ArrowLeft: { x: -1, y: 0 },
                ArrowRight: { x: 1, y: 0 },
                w: { x: 0, y: -1 },
                s: { x: 0, y: 1 },
                a: { x: -1, y: 0 },
                d: { x: 1, y: 0 },
            };
            const next = map[e.key];
            if (!next) return;
            e.preventDefault();
            trySetDirection(next);
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [trySetDirection]);

    // Touch/swipe controls — no physical keyboard on a real phone, so the
    // keyboard-only controls above would otherwise leave this silently
    // unplayable on mobile despite rendering fine.
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        let startX = 0;
        let startY = 0;

        const onTouchStart = (e) => {
            const t = e.touches[0];
            startX = t.clientX;
            startY = t.clientY;
        };

        const onTouchEnd = (e) => {
            const t = e.changedTouches[0];
            const dx = t.clientX - startX;
            const dy = t.clientY - startY;
            if (Math.abs(dx) < 20 && Math.abs(dy) < 20) return; // ignore taps/jitter

            if (Math.abs(dx) > Math.abs(dy)) {
                trySetDirection({ x: dx > 0 ? 1 : -1, y: 0 });
            } else {
                trySetDirection({ x: 0, y: dy > 0 ? 1 : -1 });
            }
        };

        canvas.addEventListener("touchstart", onTouchStart, { passive: true });
        canvas.addEventListener("touchend", onTouchEnd, { passive: true });
        return () => {
            canvas.removeEventListener("touchstart", onTouchStart);
            canvas.removeEventListener("touchend", onTouchEnd);
        };
    }, [trySetDirection]);

    // Game loop
    useEffect(() => {
        if (!running) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        const tick = () => {
            dirRef.current = nextDirRef.current;
            const snake = snakeRef.current;
            const head = snake[0];
            const newHead = { x: head.x + dirRef.current.x, y: head.y + dirRef.current.y };

            const hitWall = newHead.x < 0 || newHead.y < 0 || newHead.x >= GRID || newHead.y >= GRID;
            const hitSelf = snake.some((s) => s.x === newHead.x && s.y === newHead.y);

            if (hitWall || hitSelf) {
                setRunning(false);
                setGameOver(true);
                setBest((prevBest) => {
                    const newBest = Math.max(prevBest, score);
                    localStorage.setItem("snake_best", String(newBest));
                    return newBest;
                });
                return;
            }

            const newSnake = [newHead, ...snake];
            if (newHead.x === foodRef.current.x && newHead.y === foodRef.current.y) {
                setScore((s) => s + 1);
                foodRef.current = randomCell(newSnake);
            } else {
                newSnake.pop();
            }
            snakeRef.current = newSnake;

            // Render
            ctx.fillStyle = "#0f172a";
            ctx.fillRect(0, 0, GRID * CELL, GRID * CELL);

            ctx.fillStyle = "#f43f5e";
            ctx.fillRect(foodRef.current.x * CELL + 2, foodRef.current.y * CELL + 2, CELL - 4, CELL - 4);

            newSnake.forEach((seg, i) => {
                ctx.fillStyle = i === 0 ? "#4ade80" : "#22c55e";
                ctx.fillRect(seg.x * CELL + 1, seg.y * CELL + 1, CELL - 2, CELL - 2);
            });
        };

        const interval = setInterval(tick, SPEED_MS);
        return () => clearInterval(interval);
    }, [running, score]);

    return (
        <>
            {!embedded && (
                <div id="window-header">
                    <WindowControls target="game" />
                    <h2>Snake</h2>
                </div>
            )}

            <div className="flex flex-col items-center gap-3 bg-slate-950 p-5">
                <div className="flex justify-between w-full max-w-[360px] text-slate-200 text-sm font-medium px-1">
                    <span>Score: {score}</span>
                    <span>Best: {best}</span>
                </div>

                <div className="relative w-full max-w-[360px]">
                    <canvas
                        ref={canvasRef}
                        width={GRID * CELL}
                        height={GRID * CELL}
                        className="rounded-md border border-slate-700 w-full h-auto touch-none"
                    />

                    {!running && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-slate-950/85 rounded-md">
                            <p className="text-slate-100 font-semibold">
                                {gameOver ? `Game Over — Score: ${score}` : "Snake"}
                            </p>
                            <button
                                type="button"
                                onClick={resetGame}
                                className="px-4 py-2 rounded-lg bg-green-500 hover:bg-green-400 text-slate-950 font-semibold text-sm transition-colors"
                            >
                                {gameOver ? "Play Again" : "Start Game"}
                            </button>
                            <p className="text-slate-400 text-xs">
                                {embedded ? "Swipe or use the arrows below" : "Arrow keys or WASD to move"}
                            </p>
                        </div>
                    )}
                </div>

                {embedded && (
                    <div className="grid grid-cols-3 gap-2 w-36 mt-2">
                        <div />
                        <DpadButton onPress={() => trySetDirection({ x: 0, y: -1 })} label="up" />
                        <div />
                        <DpadButton onPress={() => trySetDirection({ x: -1, y: 0 })} label="left" />
                        <DpadButton onPress={() => trySetDirection({ x: 0, y: 1 })} label="down" />
                        <DpadButton onPress={() => trySetDirection({ x: 1, y: 0 })} label="right" />
                    </div>
                )}
            </div>
        </>
    );
};

const ARROWS = { up: "↑", down: "↓", left: "←", right: "→" };

const DpadButton = ({ onPress, label }) => (
    <button
        type="button"
        onClick={onPress}
        aria-label={label}
        className="aspect-square rounded-lg bg-white/10 active:bg-white/20 text-white text-lg flex items-center justify-center select-none"
    >
        {ARROWS[label]}
    </button>
);

const GameWindow = WindowWrapper(Game, "game");
export default GameWindow;
export { Game };
