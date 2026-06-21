import re
import os

def clean_markdown_file(file_path):
    # 读取文件内容
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 保存原始frontmatter（如果存在）
    original_frontmatter = ""
    lines = content.split('\n')
    
    # 检查是否有frontmatter在开头
    if len(lines) > 2 and lines[0].strip() == '---':
        # 找到第一个frontmatter的结束位置
        end_idx = 0
        for i in range(1, len(lines)):
            if lines[i].strip() == '---':
                end_idx = i
                break
        
        if end_idx > 0:
            original_frontmatter = '\n'.join(lines[:end_idx+1]) + '\n'
            remaining_content = '\n'.join(lines[end_idx+1:])
        else:
            remaining_content = content
    else:
        remaining_content = content
    
    # 移除多余的空行，但保留段落间的单个空行
    cleaned_lines = []
    for i, line in enumerate(remaining_content.split('\n')):
        # 跳过连续的空行
        if line.strip() == '':
            if i > 0 and remaining_content.split('\n')[i-1].strip() != '':
                cleaned_lines.append(line)
        # 跳除开头的空行（保留frontmatter后的一个空行）
        elif not (line.strip() == '' and i < 5 and original_frontmatter):
            # 保留有用的分隔线（如between major sections）
            if line.strip() == '---' and i > 0 and i < len(remaining_content.split('\n')) - 1:
                next_line = remaining_content.split('\n')[i+1] if i+1 < len(remaining_content.split('\n')) else ''
                prev_line = remaining_content.split('\n')[i-1] if i-1 >= 0 else ''
                # 如果分隔线前后都有内容，保留
                if next_line.strip() != '' and prev_line.strip() != '':
                    cleaned_lines.append(line)
            elif line.strip() != '---':
                cleaned_lines.append(line)
    
    # 重新组合内容
    cleaned_content = original_frontmatter + '\n'.join(cleaned_lines)
    
    # 写回文件
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(cleaned_content)
    
    print(f"Cleaned: {file_path}")

# 处理所有markdown文件
for filename in os.listdir('posts'):
    if filename.endswith('.md'):
        file_path = os.path.join('posts', filename)
        clean_markdown_file(file_path)
