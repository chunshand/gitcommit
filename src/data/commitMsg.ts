export type CommitMsg = Record<"value" | "label" | "emoji", string>
export const getDefaultMsg = (): CommitMsg[] => {
    return [
        {
            value: "feat",
            label: "新功能",
            emoji: "✨",
        },
        {
            value: "fix",
            label: "修复bug",
            emoji: "🐛",
        },
        {
            value: "docs",
            label: "文档变更",
            emoji: "📝",
        },
        {
            value: "style",
            label: "无关代码的格式",
            emoji: "🎨",
        },
        {
            value: "refactor",
            label: "重构",
            emoji: "♻️",
        },
        {
            value: "perf",
            label: "优化性能",
            emoji: "⚡",
        },
        {
            value: "test",
            label: "增加或更新测试",
            emoji: "✅",
        },
        {
            value: "build",
            label: "构建系统或外部依赖更改",
            emoji: "🛠️",
        },
        {
            value: "ci",
            label: "CI配置或脚本变动",
            emoji: "👷",
        },
        {
            value: "chore",
            label: "不影响代码的其余变动",
            emoji: "📦",
        },
        {
            value: "revert",
            label: "回退之前版本",
            emoji: "⏪",
        },
    ]
}
