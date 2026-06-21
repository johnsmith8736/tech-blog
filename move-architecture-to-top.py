import re
import os

def move_architecture_to_top(file_path):
    print(f"Processing: {file_path}")

    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Split into lines
    lines = content.split('\n')

    # Find the architecture section
    architecture_start = -1
    architecture_end = -1

    # Look for "整体架构" section
    for i, line in enumerate(lines):
        if '## 一、整体架构' in line:
            architecture_start = i
            # Find the end of this section (next ## or end of file)
            for j in range(i+1, len(lines)):
                if lines[j].startswith('## ') or lines[j].startswith('### ') or j == len(lines)-1:
                    architecture_end = j
                    break
            break

    if architecture_start == -1:
        print("  No architecture section found")
        return

    # Extract architecture section
    architecture_lines = lines[architecture_start:architecture_end]

    # Remove the original architecture section
    new_lines = lines[:architecture_start] + lines[architecture_end:]

    # Find where to insert the architecture (after title/frontmatter)
    insert_pos = 0

    # Skip frontmatter if exists
    if len(new_lines) > 0 and new_lines[0].strip() == '---':
        # Find end of frontmatter
        for i in range(1, len(new_lines)):
            if new_lines[i].strip() == '---':
                insert_pos = i + 2  # After frontmatter
                break

    # Insert architecture after title
    if insert_pos == 0 and len(new_lines) > 0:
        # Find the title line (starts with #)
        for i, line in enumerate(new_lines):
            if line.startswith('# '):
                insert_pos = i + 1
                break

    # Insert the architecture
    new_lines = new_lines[:insert_pos] + architecture_lines + new_lines[insert_pos:]

    # Write back
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write('\n'.join(new_lines))

    print(f"  Moved architecture from line {architecture_start+1} to top")

# Process all markdown files
for filename in os.listdir('posts'):
    if filename.endswith('.md'):
        move_architecture_to_top(os.path.join('posts', filename))