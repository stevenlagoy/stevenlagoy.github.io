import twochre_thumb from "@assets/twochre_thumb.png";
import pokemon_thumb from "@assets/pokemon_thumb.png";
import demographics_thumb from "@assets/demographics_thumb.png";
import whats_that_song_thumb from "@assets/whats_that_song_thumb.png";

export const projects = [
    {
        imgSrc: twochre_thumb,
        projectName: "Twochre",
        projectDate: "February 2025",
        technologies: "HTML, CSS, & Javascript",
        projectDesc: "A card game based on Euchre, with AI opponent behavior and unique mechanics. Play against 4 opponents in a game where nobody knows what card they'll play next.",
        projectPath: "/twochre"
    },
    {
        imgSrc: pokemon_thumb,
        projectName: "Pokémon Platinum Level Grind Locator",
        projectDate: "May 2025",
        technologies: "HTML, CSS, & Typescript",
        projectDesc: "Calculator for Pokémon Platinum which suggests locations to earn experience based on your Pokémon's type and abilities.",
        projectPath: "/pokemon"
    },
    {
        imgSrc: demographics_thumb,
        projectName: "US Demographics Visualizer",
        projectDate: "Fall 2025 - Spring 2026",
        technologies: "Javascript, Python",
        projectDesc: "A visualization tool for my ongoing research with the PFW Honors Program and JPUR to explore demographic information in the US by county.",
        projectPath: "/us-demographics-visualizer"
    },
    {
        imgSrc: whats_that_song_thumb,
        projectName: "What's That Song?",
        projectDate: "October 2025",
        technologies: "React, RapidAPI",
        projectDesc: "A game using the Spotify API to create a game from your favorite playlists, artists, or albums.",
        projectPath: "/whats-that-song"
    },
]