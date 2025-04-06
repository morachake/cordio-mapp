import React from "react";
import { Redirect } from "expo-router";

const Home = () => {
  return <Redirect href="/(auth)/splash" />;
};

export default Home;