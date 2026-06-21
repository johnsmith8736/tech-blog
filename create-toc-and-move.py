import re
import os

def extract_chapters(file_path):
    """Extract chapter titles from markdown file"""
    chapters = []
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    lines = content.split('\n')

    for line in lines:
        # Match ## headers (main sections)
        match = re.match(r'^##\s+(.+)', line)
        if match:
            title = match.group(1).strip()
            # Skip if it's just a number
            if not re.match(r'^\d+$', title):
                chapters.append(title)

    return chapters

def create_toc(chapters):
    """Create table of contents from chapters"""
    toc = ["## 目录\n"]
    for i, chapter in enumerate(chapters, 1):
        toc.append(f"{i}. {chapter}\n")
    toc.append("")  # Empty line
    return toc

def move_toc_to_top(file_path):
    print(f"Processing: {file_path}")

    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    lines = content.split('\n')

    # Extract chapters
    chapters = []
    chapter_lines = []

    for i, line in enumerate(lines):
        match = re.match(r'^##\s+(.+)', line)
        if match:
            title = match.group(1).strip()
            if not re.match(r'^\d+$', title):
                chapters.append(title)
                chapter_lines.append((i, line))

    if not chapters:
        print("  No chapters found to create TOC")
        return

    # Create TOC
    toc = create_toc(chapters)
    toc_content = '\n'.join(toc)

    # Find where to insert TOC (after title/frontmatter)
    insert_pos = 0

    # Skip frontmatter if exists
    if len(lines) > 0 and lines[0].strip() == '---':
        # Find end of frontmatter
        for i in range(1, len(lines)):
            if lines[i].strip() == '---':
                insert_pos = i + 2
                break

    # Insert TOC after title if no frontmatter
    if insert_pos == 0:
        # Find the title line (starts with #)
        for i, line in enumerate(lines):
            if line.startswith('# ') and not line.startswith('##'):
                insert_pos = i + 1
                break

    if insert_pos == 0:
        insert_pos = 1  # After first line if no title found

    # Insert TOC
    new_lines = lines[:insert_pos] + toc_content.split('\n') + lines[insert_pos:]

    # Write back
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write('\n'.join(new_lines))

    print(f"  Created TOC with {len(chapters)} chapters and moved to position {insert_pos}")

# Process all markdown files
for filename in os.listdir('posts'):
    if filename.endswith('.md'):
        move_toc_to_top(os.path.join('posts', filename))