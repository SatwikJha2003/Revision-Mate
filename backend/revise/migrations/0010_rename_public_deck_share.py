# Generated by Django 5.0.6 on 2024-06-24 07:24

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('revise', '0009_alter_deck_public'),
    ]

    operations = [
        migrations.RenameField(
            model_name='deck',
            old_name='public',
            new_name='share',
        ),
    ]
