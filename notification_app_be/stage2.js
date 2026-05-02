const axios = require("axios");
const logger = require("../logging_middleware/logger");

// 🔐 Paste your latest token here
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJhZDYwODFAc3JtaXN0LmVkdS5pbiIsImV4cCI6MTc3NzcwNTQ1MiwiaWF0IjoxNzc3NzA0NTUyLCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiYmIwMmI1YjgtZTJiNS00M2U3LWJjMDEtODgzYWQ2ZGJiMDczIiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoiYXNpZiB1bWFyIGJhYmEiLCJzdWIiOiJkMTY1ZmZkOC1jMGI1LTRjNGQtOTQ1YS00NTM1YTQ1ZjUwZDIifSwiZW1haWwiOiJhZDYwODFAc3JtaXN0LmVkdS5pbiIsIm5hbWUiOiJhc2lmIHVtYXIgYmFiYSIsInJvbGxObyI6InJhMjMxMTAwMzAxMTEzNCIsImFjY2Vzc0NvZGUiOiJRa2JweEgiLCJjbGllbnRJRCI6ImQxNjVmZmQ4LWMwYjUtNGM0ZC05NDVhLTQ1MzVhNDVmNTBkMiIsImNsaWVudFNlY3JldCI6IkZHYndQWmJIR2J1VHFEc3kifQ.tNi5S9q_cpRzpdzSCfODSSW7spv1eBwG2gvLUPkERgU";


const API_URL = "http://20.207.122.201/evaluation-service/notifications";

// Priority map
const priority = {
  Placement: 3,
  Event: 2,
  Result: 1
};

// 🔥 Compare function
function compare(a, b) {
  if (priority[a.Type] !== priority[b.Type]) {
    return priority[a.Type] - priority[b.Type]; // min heap (lowest first)
  }
  return new Date(a.Timestamp) - new Date(b.Timestamp);
}

// 🔥 Min Heap class
class MinHeap {
  constructor() {
    this.heap = [];
  }

  push(item) {
    this.heap.push(item);
    this.bubbleUp();
  }

  pop() {
    if (this.heap.length === 1) return this.heap.pop();
    const top = this.heap[0];
    this.heap[0] = this.heap.pop();
    this.bubbleDown();
    return top;
  }

  peek() {
    return this.heap[0];
  }

  size() {
    return this.heap.length;
  }

  bubbleUp() {
    let index = this.heap.length - 1;

    while (index > 0) {
      let parent = Math.floor((index - 1) / 2);

      if (compare(this.heap[index], this.heap[parent]) >= 0) break;

      [this.heap[index], this.heap[parent]] =
        [this.heap[parent], this.heap[index]];

      index = parent;
    }
  }

  bubbleDown() {
    let index = 0;
    const length = this.heap.length;

    while (true) {
      let left = 2 * index + 1;
      let right = 2 * index + 2;
      let smallest = index;

      if (left < length && compare(this.heap[left], this.heap[smallest]) < 0) {
        smallest = left;
      }

      if (right < length && compare(this.heap[right], this.heap[smallest]) < 0) {
        smallest = right;
      }

      if (smallest === index) break;

      [this.heap[index], this.heap[smallest]] =
        [this.heap[smallest], this.heap[index]];

      index = smallest;
    }
  }
}

async function main() {
  try {
    logger("Fetching notifications...");

    const res = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${TOKEN}`
      }
    });

    const notifications = res.data.notifications;

    logger("Maintaining Top 10 using Min Heap...");

    const heap = new MinHeap();

    for (let n of notifications) {
      heap.push(n);

      if (heap.size() > 10) {
        heap.pop(); // remove lowest priority
      }
    }

    // Convert heap → sorted output (highest first)
    const result = heap.heap.sort((a, b) => {
      if (priority[b.Type] !== priority[a.Type]) {
        return priority[b.Type] - priority[a.Type];
      }
      return new Date(b.Timestamp) - new Date(a.Timestamp);
    });

    console.log("===== TOP 10 (Stage 2 Optimized) =====");

    result.forEach((n, i) => {
      console.log(`${i + 1}. [${n.Type}] ${n.Message} - ${n.Timestamp}`);
    });

    logger("Stage 2 completed successfully.");

  } catch (err) {
    logger("Error occurred!");
    console.error(err.response?.data || err.message);
  }
}

main();