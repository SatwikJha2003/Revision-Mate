# Generated by Django 5.0.6 on 2024-07-11 07:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('revise', '0022_alter_history_rating'),
    ]

    operations = [
        migrations.CreateModel(
            name='Comments',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('user', models.IntegerField()),
                ('deck', models.IntegerField()),
                ('comment', models.TextField()),
            ],
        ),
    ]
