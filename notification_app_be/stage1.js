const axios = require("axios");
const logger = require("../logging_middleware/logger"); 
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJhZDYwODFAc3JtaXN0LmVkdS5pbiIsImV4cCI6MTc3NzcwNTQ1MiwiaWF0IjoxNzc3NzA0NTUyLCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiYmIwMmI1YjgtZTJiNS00M2U3LWJjMDEtODgzYWQ2ZGJiMDczIiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoiYXNpZiB1bWFyIGJhYmEiLCJzdWIiOiJkMTY1ZmZkOC1jMGI1LTRjNGQtOTQ1YS00NTM1YTQ1ZjUwZDIifSwiZW1haWwiOiJhZDYwODFAc3JtaXN0LmVkdS5pbiIsIm5hbWUiOiJhc2lmIHVtYXIgYmFiYSIsInJvbGxObyI6InJhMjMxMTAwMzAxMTEzNCIsImFjY2Vzc0NvZGUiOiJRa2JweEgiLCJjbGllbnRJRCI6ImQxNjVmZmQ4LWMwYjUtNGM0ZC05NDVhLTQ1MzVhNDVmNTBkMiIsImNsaWVudFNlY3JldCI6IkZHYndQWmJIR2J1VHFEc3kifQ.tNi5S9q_cpRzpdzSCfODSSW7spv1eBwG2gvLUPkERgU";

const API_URL = "http://20.207.122.201/evaluation-service/notifications";

const priority = {
  Placement: 3,
  Event: 2,
  Result: 1
};

async function main() {
  try {
    logger("Fetching notifications from API..."); // 👈 NEW

    const res = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${TOKEN}`
      }
    });

    let notifications = res.data.notifications;

    logger("Sorting notifications by priority and timestamp..."); // 👈 NEW

    notifications.sort((a, b) => {
      if ((priority[b.Type] || 0) !== (priority[a.Type] || 0)) {
        return (priority[b.Type] || 0) - (priority[a.Type] || 0);
      }
      return new Date(b.Timestamp) - new Date(a.Timestamp);
    });

    logger("Selecting top 10 notifications..."); // 👈 NEW

    const top10 = notifications.slice(0, 10);

    console.log("===== TOP 10 NOTIFICATIONS =====");

    top10.forEach((n, i) => {
      console.log(`${i + 1}. [${n.Type}] ${n.Message} - ${n.Timestamp}`);
    });

    logger("Process completed successfully."); // 👈 NEW

  } catch (err) {
    logger("Error occurred!"); // 👈 NEW
    console.error(err.response?.data || err.message);
  }
}

main();