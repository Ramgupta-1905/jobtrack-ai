import { useState } from "react";

export default function MiniCalendar({ events = [] }) {
  const [currentDate, setCurrentDate] = useState(
    new Date()
  );

  const month = currentDate.toLocaleString(
    "default",
    { month: "long" }
  );

  const year = currentDate.getFullYear();

  const previousMonth = () => {
    setCurrentDate(
      new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - 1,
        1
      )
    );
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        1
      )
    );
  };

  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  const today = new Date();

  const isCurrentMonth =
    today.getMonth() === currentDate.getMonth() &&
    today.getFullYear() === currentDate.getFullYear();

  const eventColors = {
    interview: "bg-green-500",
    assessment: "bg-blue-500",
    deadline: "bg-red-500",
  };

  const totalCells = 42;
  const daysArray = [];

  for (let i = 0; i < totalCells; i++) {
    const dayNumber =
      i - firstDayOfMonth + 1;

    if (
      dayNumber > 0 &&
      dayNumber <= daysInMonth
    ) {
      daysArray.push({
        day: dayNumber,
        currentMonth: true,
      });
    } else if (dayNumber <= 0) {
      const prevMonthDays = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        0
      ).getDate();

      daysArray.push({
        day: prevMonthDays + dayNumber,
        currentMonth: false,
      });
    } else {
      daysArray.push({
        day: dayNumber - daysInMonth,
        currentMonth: false,
      });
    }
  }

  const getEventsForDay = (day) => {
    return events.filter((event) => {
      if (!event.date) {
        return false;
      }

      const eventDate = new Date(
        `${event.date}T00:00:00`
      );

      return (
        eventDate.getDate() === day &&
        eventDate.getMonth() === currentDate.getMonth() &&
        eventDate.getFullYear() === currentDate.getFullYear()
      );
    });
  };

  return (
    <div className="w-[300px] rounded-xl bg-white p-4 shadow-md">

      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-900">
          📅 {month} {year}
        </h2>

        <div className="flex gap-1">
          <button
            onClick={previousMonth}
            className="rounded-md p-1 text-sm text-gray-700 transition hover:bg-gray-200"
          >
            ←
          </button>

          <button
            onClick={nextMonth}
            className="rounded-md p-1 text-sm text-gray-700 transition hover:bg-gray-200"
          >
            →
          </button>
        </div>
      </div>

      {/* Weekdays */}
      <div className="mt-3 grid grid-cols-7 text-center text-xs font-medium text-gray-500">
        {[
          "Su",
          "Mo",
          "Tu",
          "We",
          "Th",
          "Fr",
          "Sa",
        ].map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="mt-2 grid grid-cols-7 gap-1">
        {daysArray.map(
          ({ day, currentMonth }, index) => {
            const dayEvents =
              getEventsForDay(day);

            return (
              <div
                key={index}
                className={`flex h-8 cursor-pointer flex-col items-center justify-center rounded-md transition ${
                  currentMonth
                    ? isCurrentMonth &&
                      day === today.getDate()
                      ? "bg-blue-600 font-semibold text-white"
                      : "text-gray-700 hover:bg-gray-200"
                    : "text-gray-400"
                }`}
              >
                <span className="text-xs">
                  {day}
                </span>

                <div className="mt-0.5 flex min-h-[4px] items-center justify-center gap-0.5">
                  {dayEvents.map(
                    (event, idx) => (
                      <span
                        key={idx}
                        className={`h-[5px] w-[5px] rounded-full ${
                          eventColors[
                            event.type
                          ] || "bg-gray-400"
                        }`}
                      />
                    )
                  )}
                </div>
              </div>
            );
          }
        )}
      </div>

      {/* Legend */}
      <div className="mt-3">
        <h3 className="mb-1 text-xs font-semibold text-gray-900">
          Legend
        </h3>

        <div className="flex gap-3 text-xs text-gray-700">
          {Object.entries(eventColors).map(
            ([type, color]) => (
              <div
                key={type}
                className="flex items-center gap-1"
              >
                <span
                  className={`h-2 w-2 rounded-full ${color}`}
                />

                <span className="capitalize">
                  {type}
                </span>
              </div>
            )
          )}
        </div>
      </div>

    </div>
  );
}