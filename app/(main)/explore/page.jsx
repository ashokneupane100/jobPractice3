import { getInterviewers } from "@/actions/explore";
import PageHeader from "@/components/reusables";
import React from "react";
import ExploreGrid from "./_components/EploreGrid";

const ExplorePage = async () => {
  const interviewers = await getInterviewers();

  return (
    <main className="min-h-screen bg-black">
      <PageHeader
        label="Explore"
        gray="Find your"
        gold="expert interviewers"
        description="Browse senior engineers from top companies."
      />
      <div className="max-w-6xl mx-auto px-8 xl:px-0 py-10">
        <ExploreGrid interviewers={interviewers} />

      


      </div>


    </main>
  );
};

export default ExplorePage;
