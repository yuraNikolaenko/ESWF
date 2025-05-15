from django.db import models


class LogisticOrder(models.Model):
    class OrderType(models.TextChoices):
        DISTRIBUTION = "distribution", "Distribution"
        COLLECTION = "collection", "Collection"

    class Status(models.TextChoices):
        PLANNED = "planned", "Planned"
        IN_PROGRESS = "in_progress", "In Progress"
        COMPLETED = "completed", "Completed"

    name = models.CharField(max_length=255)
    type = models.CharField(max_length=20, choices=OrderType.choices)
    contract = models.ForeignKey("core.Contract", on_delete=models.CASCADE)
    organization = models.ForeignKey("core.Organization", on_delete=models.CASCADE)
    total_quantity = models.DecimalField(max_digits=12, decimal_places=2)
    required_date = models.DateField()
    transport_mode = models.CharField(max_length=50)  # e.g., auto, rail, mixed
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PLANNED)
    comment = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class LogisticLeg(models.Model):
    class LegStatus(models.TextChoices):
        PLANNED = "planned", "Planned"
        ASSIGNED = "assigned", "Assigned"
        COMPLETED = "completed", "Completed"

    order = models.ForeignKey(LogisticOrder, on_delete=models.CASCADE, related_name="legs")
    item = models.ForeignKey("core.Item", on_delete=models.PROTECT)
    quantity = models.DecimalField(max_digits=12, decimal_places=2)
    from_location = models.ForeignKey("core.LocationPoint", on_delete=models.PROTECT, related_name="legs_from")
    to_location = models.ForeignKey("core.LocationPoint", on_delete=models.PROTECT, related_name="legs_to")
    transport_type = models.CharField(max_length=50)
    vehicle = models.ForeignKey("fleet.Vehicle", on_delete=models.SET_NULL, null=True, blank=True)
    planned_date = models.DateField()
    actual_date = models.DateField(null=True, blank=True)
    cost_estimate = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    cost_actual = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    status = models.CharField(max_length=20, choices=LegStatus.choices, default=LegStatus.PLANNED)

    def __str__(self):
        return f"{self.item.name} {self.from_location.name} → {self.to_location.name}"
