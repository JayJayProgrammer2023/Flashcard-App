# Generated by Django 4.2.2 on 2023-07-20 08:20

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0007_rename_userid_decks_user_delete_accounts'),
    ]

    operations = [
        migrations.DeleteModel(
            name='Decks',
        ),
    ]
