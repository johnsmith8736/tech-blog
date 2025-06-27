import os
import re
import yaml
from datetime import datetime
from django.core.wsgi import get_wsgi_application

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'techblog_backend.settings')
application = get_wsgi_application()

from blog.models import Post
from django.utils.text import slugify

def import_markdown_posts(posts_dir='../posts', clean_before_import=False):
    print(f"Starting import process from directory: {posts_dir}")

    if clean_before_import:
        confirm = input("WARNING: This will delete all existing blog posts. Are you sure you want to proceed? (yes/no): ")
        if confirm.lower() == 'yes':
            print("Deleting all existing posts...")
            Post.objects.all().delete()
            print("All existing posts deleted.")
        else:
            print("Deletion cancelled. Aborting import.")
            return

    processed_count = 0
    created_count = 0
    updated_count = 0
    skipped_count = 0

    for filename in os.listdir(posts_dir):
        if filename.endswith('.md'):
            filepath = os.path.join(posts_dir, filename)
            print(f"\n--- Processing file: {filename} ---")
            try:
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()

                # Split front matter and content
                match = re.match(r'---\n(.*?)\n---\n(.*)', content, re.DOTALL)
                if not match:
                    print(f"  Skipped: No valid front matter found.")
                    skipped_count += 1
                    continue

                front_matter_str = match.group(1)
                body_content = match.group(2).strip()

                try:
                    front_matter = yaml.safe_load(front_matter_str)
                except yaml.YAMLError as e:
                    print(f"  Skipped: Error parsing YAML front matter: {e}")
                    skipped_count += 1
                    continue

                title = front_matter.get('title')
                date_str = front_matter.get('date')
                excerpt = front_matter.get('excerpt')

                if not title or not date_str:
                    print(f"  Skipped: Missing 'title' or 'date' in front matter.")
                    skipped_count += 1
                    continue

                post_slug = slugify(title) # Always generate slug from title

                try:
                    post_date = datetime.strptime(date_str, '%Y-%m-%d').date()
                except ValueError:
                    print(f"  Skipped: Invalid date format for '{date_str}'. Expected YYYY-MM-DD.")
                    skipped_count += 1
                    continue

                # Check if a post with this slug already exists
                post_exists = Post.objects.filter(slug=post_slug).exists()

                if post_exists:
                    post = Post.objects.get(slug=post_slug)
                    post.title = title
                    post.content = body_content
                    post.excerpt = excerpt
                    post.date = post_date
                    post.save()
                    print(f"  Updated existing post: '{title}' (Slug: {post_slug})")
                    updated_count += 1
                else:
                    Post.objects.create(
                        title=title,
                        slug=post_slug,
                        content=body_content,
                        excerpt=excerpt,
                        date=post_date
                    )
                    print(f"  Created new post: '{title}' (Slug: {post_slug})")
                    created_count += 1
                processed_count += 1

            except Exception as e:
                print(f"  An unexpected error occurred while processing {filename}: {e}")
                skipped_count += 1

    print(f"\n--- Import process finished ---")
    print(f"Total files processed: {processed_count + skipped_count}")
    print(f"Posts created: {created_count}")
    print(f"Posts updated: {updated_count}")
    print(f"Files skipped due to errors/missing data: {skipped_count}")

if __name__ == '__main__':
    # To import posts without cleaning existing ones:
    import_markdown_posts()

    # To delete all existing posts before importing, uncomment the line below and comment the above line:
    # import_markdown_posts(clean_before_import=True)