# 议题追踪器：GitHub [Issue Tracker: GitHub]

本仓库的需求文档 [PRDs] 与任务议题 [Issues] 存放在 GitHub Issues 中。所有操作使用 `gh` CLI，并在仓库克隆目录内执行，让 `gh` 从 `git remote -v` 自动推断仓库。

## 仓库 [Repository]

`marskim1130/northwind-admin`

## 约定 [Conventions]

- 创建议题 [Create Issue]：`gh issue create --title "..." --body "..."`
- 读取议题 [Read Issue]：`gh issue view <number> --comments`
- 列出议题 [List Issues]：`gh issue list --state open --json number,title,body,labels,comments`
- 评论议题 [Comment Issue]：`gh issue comment <number> --body "..."`
- 添加或移除标签 [Apply or Remove Labels]：`gh issue edit <number> --add-label "..."` / `gh issue edit <number> --remove-label "..."`
- 关闭议题 [Close Issue]：`gh issue close <number> --comment "..."`

当技能 [Skill] 要求“发布到议题追踪器 [Publish to Issue Tracker]”时，创建 GitHub Issue。
