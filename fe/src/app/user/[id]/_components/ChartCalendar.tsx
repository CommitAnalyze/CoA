import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { Contribution } from "@/api/userPage/apiContributions";

interface ChartCalendarProps {
  data: Contribution[];
}

const ChartCalendar: React.FC<ChartCalendarProps> = ({ data }) => {
  // Chart svg 만들기
  const svgRef = useRef<SVGSVGElement>(null);
  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const svgWidth = svgRef.current.getBoundingClientRect().width;
    const cellSize = svgWidth / 53;
    const width = svgWidth;
    const height = cellSize * 7;
    const colorRange: string[] = [
      "#ebedf0",
      "#9be9a8",
      "#40c463",
      "#30a14e",
      "#216e39",
    ];
    const color = d3.scaleQuantize([0, 4], colorRange);
    const monthColorRange = [
      "#66CCCC", // 1월: 청록색
      "#CC6699", // 2월: 분홍색
      "#99CC66", // 3월: 연두색
      "#FFCC33", // 4월: 황금색
      "#66CC99", // 5월: 민트색
      "#FF6666", // 6월: 연분홍색
      "#6666CC", // 7월: 자주색
      "#FF9900", // 8월: 주황색
      "#66CCFF", // 9월: 하늘색
      "#FF99CC", // 10월: 분홍 자주색
      "#CCCC33", // 11월: 갈색
      "#9966FF", // 12월: 보라색
    ];
    const monthColors = d3.scaleQuantize([0, 11], monthColorRange);

    const dateExtent = d3.extent(data, (d) => new Date(d.date));
    const startDate = dateExtent[0] as Date;
    const endDate = dateExtent[1] as Date;

    const xScale = d3
      .scaleTime()
      .domain([startDate, d3.timeDay.offset(endDate, 1)])
      .range([0, width]);

    // 년도 변경시 차트가 변경되게 요소 삭제
    svg.selectAll("rect").remove();
    svg
      .attr("width", width)
      .attr("height", height)
      .selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("width", cellSize - 1)
      .attr("height", cellSize - 1)
      .attr("x", (_, i) => Math.floor(i / 7) * cellSize)
      .attr("y", (_, i) => (i % 7) * cellSize)
      .attr("fill", (d) => color(d.level))
      .attr("stroke", (d) => monthColors(new Date(d.date).getMonth()));
  }, [data]);

  return <svg className="w-full" ref={svgRef}></svg>;
};

export default ChartCalendar;