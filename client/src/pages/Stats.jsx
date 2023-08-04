import React from "react";
import { ChartsContainer, StatsContainer } from "../components";
import customFetch from "../utils/customFetch";
import { useLoaderData } from "react-router-dom";

export const loader = async () => {
  try {
    const response = await customFetch.get("/jobs/stats");
    return response.data;
  } catch (error) {
    return error;
  }
};

const Stats = () => {
  const { defaultStats, MonthlyApplications } = useLoaderData();

  return (
    <>
      <StatsContainer defaultStats={defaultStats}></StatsContainer>
      {MonthlyApplications?.length > 1 && (
        <ChartsContainer
          MonthlyApplications={MonthlyApplications}
        ></ChartsContainer>
      )}
    </>
  );
};

export default Stats;
