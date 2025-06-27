from django.db import models
from ckeditor.fields import RichTextField

class Post(models.Model):
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True, max_length=200)
    content = RichTextField()
    excerpt = models.TextField(blank=True, null=True)
    date = models.DateField()

    class Meta:
        ordering = ['-date']

    def __str__(self):
        return self.title