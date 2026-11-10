import { getInterviewers } from "@/actions/explore";
import PageHeader from "@/components/reusables";
import React from "react";

const ExplorePage = async () => {
  const interviewers = await getInterviewers();

  return <main className="min-h-screen bg-black">
        <PageHeader
        label="Explore"
        gray="Find your"
        gold="expert interviewers"
        description="Browse senior engineers from top companies." 
        
        />
  </main>;
};

export default ExplorePage;
