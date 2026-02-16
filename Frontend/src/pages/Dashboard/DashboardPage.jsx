import { useState } from "react";
import Spinner from "../../components/common/Spinner"

const DashboardPage = () => {
  const [dashboardData, setDashboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  return (
    <div>
      <Spinner></Spinner>
    </div>
  )
}

export default DashboardPage