"use client";

import { useEffect, useState } from 'react';

export default function CyberStats() {
    // 模拟随机数据波动
    const [trafficData, setTrafficData] = useState<number[]>([]);

    useEffect(() => {
        // 初始化数据 - 使用正弦波加随机噪声作为初始状态，看起来更自然
        const initialData = Array.from({ length: 20 }, (_, i) => {
            return 50 + Math.sin(i * 0.5) * 30 + (Math.random() - 0.5) * 10;
        });
        setTrafficData(initialData);

        const interval = setInterval(() => {
            setTrafficData(prev => {
                const lastValue = prev[prev.length - 1];
                // Random walk: 基于上一个值进行小幅度变化，使波形连续
                let change = (Math.random() - 0.5) * 30;
                // 倾向于回归中心 (50)
                change += (50 - lastValue) * 0.1;

                let newValue = lastValue + change;
                newValue = Math.max(10, Math.min(90, newValue)); // 限制范围，防止贴边

                return [...prev.slice(1), newValue];
            });
        }, 200); // 加快刷新频率，让动画更流畅

        return () => clearInterval(interval);
    }, []);

    // 生成平滑波浪 SVG 路径 (Cubic Bezier)
    const generatePath = () => {
        if (trafficData.length === 0) return { stroke: "", fill: "" };
        const width = 100;
        const height = 40;
        const step = width / (trafficData.length - 1);

        // 起始点
        const firstY = height - (trafficData[0] / 100 * height);
        let strokePath = `M 0 ${firstY}`;

        // 使用贝塞尔曲线连接各点
        for (let i = 0; i < trafficData.length - 1; i++) {
            const x_current = i * step;
            const y_current = height - (trafficData[i] / 100 * height);
            const x_next = (i + 1) * step;
            const y_next = height - (trafficData[i + 1] / 100 * height);

            // 控制点：使用水平中点，产生平滑的波浪效果
            const cp1x = x_current + (x_next - x_current) / 2;
            const cp1y = y_current;
            const cp2x = x_current + (x_next - x_current) / 2;
            const cp2y = y_next;

            strokePath += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${x_next} ${y_next}`;
        }

        // 闭合路径用于填充
        const fillPath = strokePath + ` L ${width} ${height} L 0 ${height} Z`;

        // 返回路径和填充路径
        return { stroke: strokePath, fill: fillPath };
    };

    const paths = generatePath();

    return (
        <div className="space-y-6">
            {/* Network Traffic Chart */}
            <div className="border border-border bg-secondary/50 p-4 clip-corner">
                <div className="flex justify-between items-end mb-2">
                    <h3 className="text-xs font-bold terminal-text" style={{ color: 'var(--cyber-cyan)' }}>
                        NET_TRAFFIC
                    </h3>
                    <span className="text-[10px] terminal-text animate-pulse" style={{ color: 'var(--cyber-yellow)' }}>
                        LIVE
                    </span>
                </div>

                <div className="relative h-20 w-full border border-border/50 bg-background/50 overflow-hidden">
                    {/* Grid Lines */}
                    <div className="absolute inset-0 grid grid-cols-4 grid-rows-2">
                        <div className="border-r border-border/30"></div>
                        <div className="border-r border-border/30"></div>
                        <div className="border-r border-border/30"></div>
                        <div className="border-b border-border/30 col-span-4 row-start-2"></div>
                    </div>

                    {/* Chart */}
                    <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 40">
                        {/* Fill Area */}
                        <path
                            d={paths.fill}
                            fill="var(--cyber-cyan)"
                            fillOpacity="0.1"
                            stroke="none"
                        />
                        {/* Stroke Line */}
                        <path
                            d={paths.stroke}
                            fill="none"
                            stroke="var(--cyber-cyan)"
                            strokeWidth="1.5"
                            vectorEffect="non-scaling-stroke"
                            className="drop-shadow-[0_0_3px_rgba(0,240,240,0.5)]"
                        />
                    </svg>
                </div>

                <div className="flex justify-between mt-2 text-[10px] text-muted-foreground terminal-text">
                    <span>IN: 45.2 MB/s</span>
                    <span>OUT: 12.8 MB/s</span>
                </div>
            </div>

            {/* Skill Matrix */}
            <div className="border border-border bg-secondary/50 p-4 clip-corner">
                <h3 className="text-xs font-bold terminal-text mb-4" style={{ color: 'var(--cyber-yellow)' }}>
                    SKILL_MATRIX
                </h3>
                <div className="space-y-3">
                    {[
                        { name: 'PYTHON', level: 92, color: 'var(--cyber-yellow)' },
                        { name: 'REACT/NEXT', level: 85, color: 'var(--cyber-cyan)' },
                        { name: 'SECURITY', level: 78, color: '#ff0055' }, // Red/Pink for security
                        { name: 'SYS_ARCH', level: 88, color: '#00ff00' }, // Green for system
                    ].map((skill) => (
                        <div key={skill.name} className="space-y-1">
                            <div className="flex justify-between text-[10px] terminal-text">
                                <span>{skill.name}</span>
                                <span>{skill.level}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-muted relative overflow-hidden">
                                <div
                                    className="h-full absolute top-0 left-0 transition-all duration-1000"
                                    style={{
                                        width: `${skill.level}%`,
                                        backgroundColor: skill.color,
                                        boxShadow: `0 0 5px ${skill.color}`
                                    }}
                                ></div>
                                {/* Scanline effect */}
                                <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite] transform -skew-x-12"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
