# Generated by Django 5.0.6 on 2024-07-11 02:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('revise', '0021_alter_deck_rating'),
    ]

    operations = [
        migrations.AlterField(
            model_name='history',
            name='rating',
            field=models.IntegerField(default=0),
        ),
    ]
