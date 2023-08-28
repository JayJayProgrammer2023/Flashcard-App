from django.core.exceptions import ValidationError
from django.utils.translation import gettext as _

def validate_password_similarity(password, user):
    if password.lower() in user.username.lower():
        raise ValidationError(_("Password must not be too similar to the username."), code='password_too_similar_username')
    if user.email and password.lower() in user.email.lower():
        raise ValidationError(_("Password must not be too similar to the email."), code='password_too_similar_email')