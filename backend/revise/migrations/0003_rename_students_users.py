# Generated by Django 5.0.6 on 2024-06-11 12:33

from django.conf import settings
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('revise', '0002_students'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.RenameModel(
            old_name='Students',
            new_name='Users',
        ),
    ]