import re
from datetime import datetime, date
from ..models import Vehicle

def apply_rule_filters(user_message: str):
    current_year = datetime.now().year
    user_message = user_message.lower()

    match_year = re.search(r"автомоб.*старш[а-я]*\s*(за)?\s*(\d+)", user_message)
    if match_year:
        years = int(match_year.group(2))
        count = Vehicle.objects.filter(year__lt=current_year - years).count()
        return f"У базі зареєстровано {count} автомобілів, старших за {years} років."

    match_driver = re.search(r"автомоб.*вод.*старш[а-я]*\s*(за)?\s*(\d+)", user_message)
    if match_driver:
        years = int(match_driver.group(2))
        cutoff_date = date.today().replace(year=date.today().year - years)
        count = Vehicle.objects.filter(
            driver__isnull=False,
            driver__birth_date__lt=cutoff_date
        ).count()
        return f"У базі {count} автомобілів, закріплених за водіями віком понад {years} років."

    return None
