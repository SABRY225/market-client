import axios from "axios";

export default async function getReportsData(period) {
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/reports?period=${period}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    });
    return res.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
}
