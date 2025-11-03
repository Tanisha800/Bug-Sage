"use client"
import React from "react";

import LetterGlitch from "./LetterGlitch";
import SplitText from "./SplitText";
import { SaveButton } from "@/components/ui/save-button"


function HeroSection() {
  return (

    <div style={{ width: "100%", height: "100vh", position: "relative" }}>
  
  <LetterGlitch
    glitchSpeed={50}
    centerVignette={true}
    outerVignette={false}
    smooth={true}
  /><div
    style={{
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "black",
      opacity: 0.5,
      pointerEvents: "none", // so overlay doesn’t block interactions
    }}
    
  />
  <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
        }}
      >
        <SplitText
          text="“Squash Bugs Before They Squash You!”"
          className="text-6xl font-semibold text-white"
          delay={100}
          duration={0.6}
          ease="power3.out"
          splitType="chars"
          from={{ opacity: 0, y: 40 }}
          to={{ opacity: 1, y: 0 }}
          threshold={0.1}
          rootMargin="-100px"
        />



 
    <SaveButton 
      text={{
        idle: "Save me, please!",
        saving: "Working on it...",
        saved: "Saved! Woohoo!"
      }}
    />


      </div>
      <div style={{ position: "fixed", top: 200, left: 200 }}>
       
      </div>
    </div>
  );
}

export default HeroSection;
