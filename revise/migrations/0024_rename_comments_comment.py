# Generated by Django 5.0.6 on 2024-07-11 07:54

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('revise', '0023_comments'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='Comments',
            new_name='Comment',
        ),
    ]
