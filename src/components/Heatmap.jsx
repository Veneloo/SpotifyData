import React, { useState, useEffect } from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import "../styles/Heatmap.css";
import spotifyData from "../data/spotifyData.json"; 
import { Tooltip } from "react-tooltip";

const Heatmap = () => {
  const [monthlyData, setMonthlyData] = useState([]);

  useEffect(() => {
    const aggregatedData = spotifyData.reduce((acc, entry) => {
      const date = entry.endTime.split(" ")[0]; // Extract date
      if (!acc[date]) {
        acc[date] = { totalSongs: 0, totalMsPlayed: 0, mostPlayed: {} };
      }
      acc[date].totalSongs += 1; // Count songs
      acc[date].totalMsPlayed += entry.msPlayed; // Total playtime

      // Track the most played song
      const songKey = `${entry.trackName} by ${entry.artistName}`;
      if (!acc[date].mostPlayed[songKey]) {
        acc[date].mostPlayed[songKey] = entry.msPlayed;
      } else {
        acc[date].mostPlayed[songKey] += entry.msPlayed;
      }
      return acc;
    }, {});

    const transformedData = Object.keys(aggregatedData).map((date) => {
      const mostPlayedSong = Object.entries(
        aggregatedData[date].mostPlayed
      ).reduce(
        (top, current) => (current[1] > top[1] ? current : top),
        ["", 0]
      )[0];

      return {
        date,
        count: aggregatedData[date].totalSongs,
        totalMsPlayed: aggregatedData[date].totalMsPlayed,
        mostPlayedSong,
      };
    });

    // Group data by month (YYYY-MM)
    const groupedByMonth = transformedData.reduce((acc, entry) => {
      const month = entry.date.slice(0, 7); // Get YYYY-MM
      if (!acc[month]) acc[month] = [];
      acc[month].push(entry);
      return acc;
    }, {});

    // Add an empty December 
    if (!groupedByMonth["2024-12"]) {
      groupedByMonth["2024-12"] = [];
    }

    const monthlyDataArray = Object.entries(groupedByMonth).map(
      ([month, values]) => ({
        month,
        values,
      })
    );

    setMonthlyData(monthlyDataArray);
  }, []);

  return (
    <div>
      <div className="calendar-heatmaps">
        {monthlyData.map(({ month, values }) => (
          <div key={month} className="calendar-month">
            <h2>{month}</h2>
            <CalendarHeatmap
              startDate={`${month}-01`}
              endDate={`${month}-31`}
              values={values}
              classForValue={(value) => {
                if (!value || !value.count) return "color-empty";
                return `color-scale-${Math.min(value.count, 4)}`;
              }}
              tooltipDataAttrs={(value) => ({
                "data-tooltip-id": "spotify-tooltip",
                "data-tooltip-content": value && value.date
                  ? `Date: ${value.date}, Songs: ${value.count}, Most Played: ${value.mostPlayedSong}`
                  : "No data",
              })}
              showWeekdayLabels={false} // Hide weekday labels
            />
          </div>
        ))}
      </div>
      <Tooltip id="spotify-tooltip" />
    </div>
  );
};

export default Heatmap;
