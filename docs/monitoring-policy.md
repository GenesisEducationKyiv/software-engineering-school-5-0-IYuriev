# Alerts

## 1. Log-based Alerts

- **Email sending errors:**  
  Alert when error logs related to failed email sending appear (e.g., SMTP issues, email provider downtime).  
  _Importance_: Enables quick response to mailing service failures so users do not miss important notifications.

- **Provider integration failures:**  
  Alert when errors related to requests to external providers appear.  
  _Importance_: Helps detect issues with receiving up-to-date data for users.

- **Log anomalies:**  
  Alert when unusual or new types of errors appear.  
  _Importance_: Allows detection of new bugs or attacks.

## 2. Metric-based Alerts

- **API response latency:**  
  Alert when the average response time of endpoints `/api/weather`, `/api/subscribe` exceeds 2 seconds.  
  _Importance_: Signals performance issues that may affect user experience.

- **Container resource usage:**  
  Alert when CPU/RAM thresholds are exceeded for services (especially email, gateway, subscription).  
  _Importance_: Prevents service degradation due to overload.

- **Endpoint availability:**  
  Alert when `/api/weather`, `/api/subscribe`, `/api/confirm`, `/api/unsubscribe` are unavailable.  
  _Importance_: Ensures users can always access the service.

- **Number of sent emails:**  
  Alert when the number of emails sent per hour/day drops sharply (e.g., 0 per hour).  
  _Importance_: Helps detect issues with the email service or external APIs.

---

# Log Retention Policy

- **Error logs:**
  - Retain for at least 90 days.
  - Archive after 90 days, delete after 1 year.
  - _Reason_: Errors are important for incident investigation, audit, and stability analysis.

- **Info/Warn logs:**
  - Retain for 14 days.
  - Archive after 14 days, delete after 1 month.
  - _Reason_: These logs are needed for current monitoring, load analysis, and optimization, but quickly lose relevance.

- **Debug logs:**
  - Retain for 7 days.
  - Archive after 7 days, delete after 14 days.
  - _Reason_: Debug logs are needed for troubleshooting during development and testing, but have no long-term value for production.

**Deletion/Archiving:**

- Archiving — moving logs to cheaper storage.
- Deletion — complete removal after the retention period expires.

**Why this approach:**

- Long retention for error logs — for investigation and compliance.
- Short retention for info/debug logs — to save space and enable fast analysis.
- Archiving allows keeping historical data without unnecessary costs.
