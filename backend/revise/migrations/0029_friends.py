# Generated by Django 5.0.6 on 2024-07-14 06:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('revise', '0028_remove_deck_rating'),
    ]

    operations = [
        migrations.CreateModel(
            name='Friends',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('user_one', models.IntegerField()),
                ('user_two', models.IntegerField()),
            ],
        ),
    ]
