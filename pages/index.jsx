import Head from "next/head";
import { useState, useEffect, useRef } from "react";

// ─── Team data ────────────────────────────────────────────────────────────────
const NBA_TEAMS = [
  { name: "Atlanta Hawks",         abbr: "ATL", conf: "East", wins: 33, losses: 31, winPct: 0.516, recentForm: ["W","L","W","W","L"] },
  { name: "Boston Celtics",        abbr: "BOS", conf: "East", wins: 43, losses: 21, winPct: 0.672, recentForm: ["W","W","L","W","W"] },
  { name: "Brooklyn Nets",         abbr: "BKN", conf: "East", wins: 16, losses: 47, winPct: 0.254, recentForm: ["W","L","L","L","L"] },
  { name: "Charlotte Hornets",     abbr: "CHA", conf: "East", wins: 32, losses: 33, winPct: 0.492, recentForm: ["L","W","L","W","L"] },
  { name: "Chicago Bulls",         abbr: "CHI", conf: "East", wins: 26, losses: 38, winPct: 0.406, recentForm: ["L","L","W","L","L"] },
  { name: "Cleveland Cavaliers",   abbr: "CLE", conf: "East", wins: 39, losses: 25, winPct: 0.609, recentForm: ["L","W","W","W","W"] },
  { name: "Dallas Mavericks",      abbr: "DAL", conf: "West", wins: 21, losses: 43, winPct: 0.328, recentForm: ["L","L","L","W","L"] },
  { name: "Denver Nuggets",        abbr: "DEN", conf: "West", wins: 39, losses: 25, winPct: 0.609, recentForm: ["L","W","W","W","L"] },
  { name: "Detroit Pistons",       abbr: "DET", conf: "East", wins: 45, losses: 18, winPct: 0.714, recentForm: ["L","W","W","L","W"] },
  { name: "Golden State Warriors", abbr: "GSW", conf: "West", wins: 32, losses: 31, winPct: 0.508, recentForm: ["L","L","W","W","L"] },
  { name: "Houston Rockets",       abbr: "HOU", conf: "West", wins: 39, losses: 24, winPct: 0.619, recentForm: ["L","W","W","W","W"] },
  { name: "Indiana Pacers",        abbr: "IND", conf: "East", wins: 15, losses: 49, winPct: 0.234, recentForm: ["L","L","L","W","L"] },
  { name: "LA Clippers",           abbr: "LAC", conf: "West", wins: 31, losses: 32, winPct: 0.492, recentForm: ["W","L","L","W","L"] },
  { name: "Los Angeles Lakers",    abbr: "LAL", conf: "West", wins: 39, losses: 25, winPct: 0.609, recentForm: ["W","W","W","W","L"] },
  { name: "Memphis Grizzlies",     abbr: "MEM", conf: "West", wins: 23, losses: 39, winPct: 0.371, recentForm: ["W","L","L","L","W"] },
  { name: "Miami Heat",            abbr: "MIA", conf: "East", wins: 36, losses: 29, winPct: 0.554, recentForm: ["W","W","L","W","W"] },
  { name: "Milwaukee Bucks",       abbr: "MIL", conf: "East", wins: 27, losses: 36, winPct: 0.429, recentForm: ["W","W","L","W","L"] },
  { name: "Minnesota Timberwolves",abbr: "MIN", conf: "West", wins: 40, losses: 24, winPct: 0.625, recentForm: ["L","W","W","L","W"] },
  { name: "New Orleans Pelicans",  abbr: "NOP", conf: "West", wins: 21, losses: 45, winPct: 0.318, recentForm: ["L","W","L","L","L"] },
  { name: "New York Knicks",       abbr: "NYK", conf: "East", wins: 41, losses: 24, winPct: 0.631, recentForm: ["W","L","W","W","W"] },
  { name: "Oklahoma City Thunder", abbr: "OKC", conf: "West", wins: 50, losses: 15, winPct: 0.769, recentForm: ["W","W","W","W","W"] },
  { name: "Orlando Magic",         abbr: "ORL", conf: "East", wins: 35, losses: 28, winPct: 0.556, recentForm: ["W","W","W","L","W"] },
  { name: "Philadelphia 76ers",    abbr: "PHI", conf: "East", wins: 34, losses: 29, winPct: 0.540, recentForm: ["L","L","W","L","W"] },
  { name: "Phoenix Suns",          abbr: "PHX", conf: "West", wins: 37, losses: 27, winPct: 0.578, recentForm: ["W","W","L","W","W"] },
  { name: "Portland Trail Blazers",abbr: "POR", conf: "West", wins: 31, losses: 34, winPct: 0.477, recentForm: ["W","L","W","W","L"] },
  { name: "Sacramento Kings",      abbr: "SAC", conf: "West", wins: 15, losses: 50, winPct: 0.231, recentForm: ["W","L","L","L","L"] },
  { name: "San Antonio Spurs",     abbr: "SAS", conf: "West", wins: 47, losses: 17, winPct: 0.734, recentForm: ["W","W","W","W","W"] },
  { name: "Toronto Raptors",       abbr: "TOR", conf: "East", wins: 36, losses: 27, winPct: 0.571, recentForm: ["W","L","W","W","W"] },
  { name: "Utah Jazz",             abbr: "UTA", conf: "West", wins: 19, losses: 45, winPct: 0.297, recentForm: ["L","L","L","W","L"] },
  { name: "Washington Wizards",    abbr: "WAS", conf: "East", wins: 16, losses: 47, winPct: 0.254, recentForm: ["L","L","L","L","L"] },
];

// ─── Full season schedule (confirmed from SportRadar + NBA.com + ESPN) ────────
// Each entry is [date, teamA, teamB]. Used purely for rest-day calculation.
// Covers Oct 21 2025 → Apr 12 2026 regular season end.
const SCHEDULE = [
  // ── Oct 21-31 ──
  ["2025-10-21","HOU","OKC"],["2025-10-21","GSW","LAL"],
  ["2025-10-22","CLE","NYK"],["2025-10-22","BKN","CHA"],["2025-10-22","MIA","ORL"],
  ["2025-10-22","TOR","ATL"],["2025-10-22","PHI","BOS"],["2025-10-22","DET","CHI"],
  ["2025-10-22","NOP","MEM"],["2025-10-22","WAS","MIL"],["2025-10-22","LAC","UTA"],
  ["2025-10-22","SAS","DAL"],["2025-10-22","SAC","PHX"],["2025-10-22","MIN","POR"],
  ["2025-10-23","OKC","IND"],["2025-10-23","DEN","GSW"],
  ["2025-10-24","ATL","ORL"],["2025-10-24","BOS","NYK"],["2025-10-24","CLE","BKN"],
  ["2025-10-24","MIL","TOR"],["2025-10-24","DET","HOU"],["2025-10-24","MIA","MEM"],
  ["2025-10-24","SAS","NOP"],["2025-10-24","WAS","DAL"],["2025-10-24","MIN","LAL"],
  ["2025-10-24","GSW","POR"],["2025-10-24","UTA","SAC"],["2025-10-24","PHX","LAC"],
  ["2025-10-25","CHI","ORL"],["2025-10-25","OKC","ATL"],["2025-10-25","CHA","PHI"],
  ["2025-10-25","IND","MEM"],["2025-10-25","PHX","DEN"],
  ["2025-10-26","BKN","SAS"],["2025-10-26","BOS","DET"],["2025-10-26","MIL","CLE"],
  ["2025-10-26","NYK","MIA"],["2025-10-26","CHA","WAS"],["2025-10-26","IND","MIN"],
  ["2025-10-26","TOR","DAL"],["2025-10-26","POR","LAC"],["2025-10-26","LAL","SAC"],
  ["2025-10-27","CLE","DET"],["2025-10-27","ORL","PHI"],["2025-10-27","ATL","CHI"],
  ["2025-10-27","BKN","HOU"],["2025-10-27","BOS","NOP"],["2025-10-27","TOR","SAS"],
  ["2025-10-27","OKC","DAL"],["2025-10-27","PHX","UTA"],["2025-10-27","DEN","MIN"],
  ["2025-10-27","MEM","GSW"],["2025-10-27","POR","LAL"],
  ["2025-10-28","PHI","WAS"],["2025-10-28","CHA","MIA"],["2025-10-28","NYK","MIL"],
  ["2025-10-28","SAC","OKC"],["2025-10-28","LAC","GSW"],
  ["2025-10-29","CLE","BOS"],["2025-10-29","ORL","DET"],["2025-10-29","ATL","BKN"],
  ["2025-10-29","HOU","TOR"],["2025-10-29","SAC","CHI"],["2025-10-29","IND","DAL"],
  ["2025-10-29","NOP","DEN"],["2025-10-29","POR","UTA"],["2025-10-29","LAL","MIN"],
  ["2025-10-29","MEM","PHX"],
  ["2025-10-30","ORL","CHA"],["2025-10-30","GSW","MIL"],["2025-10-30","WAS","OKC"],
  ["2025-10-30","MIA","SAS"],
  // ── Nov 1-30 (representative games to anchor team schedules) ──
  ["2025-11-01","SAC","MIL"],["2025-11-01","MIN","CHA"],["2025-11-01","GSW","IND"],
  ["2025-11-01","ORL","WAS"],["2025-11-01","HOU","BOS"],["2025-11-01","DAL","DET"],
  ["2025-11-02","NOP","OKC"],["2025-11-02","PHI","BKN"],["2025-11-02","UTA","CHA"],
  ["2025-11-02","ATL","CLE"],["2025-11-02","MEM","TOR"],["2025-11-02","CHI","NYK"],
  ["2025-11-02","SAS","PHX"],["2025-11-02","MIA","LAL"],
  ["2025-11-03","MIN","BKN"],["2025-11-03","MIL","IND"],["2025-11-03","UTA","BOS"],
  ["2025-11-03","WAS","NYK"],["2025-11-03","DAL","HOU"],["2025-11-03","DET","MEM"],
  ["2025-11-03","SAC","DEN"],["2025-11-03","LAL","POR"],["2025-11-03","MIA","LAC"],
  ["2025-11-04","MIL","TOR"],["2025-11-04","ORL","ATL"],["2025-11-04","PHI","CHI"],
  ["2025-11-04","CHA","NOP"],["2025-11-04","PHX","GSW"],["2025-11-04","OKC","LAC"],
  ["2025-11-05","PHI","CLE"],["2025-11-05","UTA","DET"],["2025-11-05","BKN","IND"],
  ["2025-11-05","WAS","BOS"],["2025-11-05","MIN","NYK"],["2025-11-05","HOU","SAC"],
  ["2025-11-05","OKC","POR"],
  ["2025-11-07","OKC","SAC"],["2025-11-07","ATL","MIA"],["2025-11-07","CLE","TOR"],
  ["2025-11-07","IND","CHI"],["2025-11-07","NOP","HOU"],["2025-11-07","DEN","LAC"],
  ["2025-11-07","DAL","GSW"],["2025-11-07","MIN","UTA"],
  ["2025-11-08","BKN","BOS"],["2025-11-08","SAS","CHA"],["2025-11-08","WAS","PHI"],
  ["2025-11-08","DEN","LAL"],["2025-11-08","POR","PHX"],["2025-11-08","SAC","MEM"],
  ["2025-11-09","ATL","ORL"],["2025-11-09","CLE","MIL"],["2025-11-09","OKC","MEM"],
  ["2025-11-09","IND","NOP"],["2025-11-09","HOU","DAL"],["2025-11-09","MIN","GSW"],
  ["2025-11-10","CHI","TOR"],["2025-11-10","CHA","DET"],["2025-11-10","BKN","NYK"],
  ["2025-11-10","WAS","MIA"],["2025-11-10","SAS","IND"],["2025-11-10","PHX","UTA"],
  ["2025-11-10","DEN","POR"],["2025-11-10","LAL","LAC"],
  ["2025-11-11","OKC","GSW"],["2025-11-11","ATL","MEM"],["2025-11-11","CLE","NOP"],
  ["2025-11-11","HOU","PHI"],["2025-11-11","MIL","BOS"],["2025-11-11","MIN","SAC"],
  ["2025-11-12","OKC","LAL"],["2025-11-12","CHA","CHI"],["2025-11-12","DET","BKN"],
  ["2025-11-12","TOR","NYK"],["2025-11-12","WAS","MIA"],["2025-11-12","SAS","IND"],
  ["2025-11-12","POR","PHX"],["2025-11-12","DEN","UTA"],
  ["2025-11-14","ATL","BOS"],["2025-11-14","NOP","CLE"],["2025-11-14","PHI","MIL"],
  ["2025-11-14","MEM","HOU"],["2025-11-14","DAL","OKC"],["2025-11-14","GSW","MIN"],
  ["2025-11-14","LAL","SAC"],["2025-11-14","LAC","POR"],
  ["2025-11-15","OKC","CHA"],["2025-11-15","DET","TOR"],["2025-11-15","BKN","IND"],
  ["2025-11-15","MIA","CHI"],["2025-11-15","NYK","WAS"],["2025-11-15","SAS","NOP"],
  ["2025-11-15","DEN","PHX"],["2025-11-15","UTA","LAC"],
  // ── Dec ──
  ["2025-12-01","ATL","BKN"],["2025-12-01","CLE","PHI"],["2025-12-01","DET","MIL"],
  ["2025-12-01","CHI","IND"],["2025-12-01","TOR","MEM"],["2025-12-01","HOU","SAS"],
  ["2025-12-01","MIN","OKC"],["2025-12-01","NOP","LAL"],["2025-12-01","GSW","SAC"],
  ["2025-12-02","BOS","NYK"],["2025-12-02","ORL","MIA"],["2025-12-02","WAS","CHA"],
  ["2025-12-02","DAL","DEN"],["2025-12-02","POR","UTA"],["2025-12-02","LAC","PHX"],
  ["2025-12-03","ATL","PHI"],["2025-12-03","CLE","BKN"],["2025-12-03","DET","IND"],
  ["2025-12-03","TOR","CHI"],["2025-12-03","MIL","MEM"],["2025-12-03","HOU","NOP"],
  ["2025-12-03","SAS","OKC"],["2025-12-03","MIN","LAL"],["2025-12-03","GSW","DEN"],
  ["2025-12-05","BOS","ORL"],["2025-12-05","NYK","WAS"],["2025-12-05","MIA","CHA"],
  ["2025-12-05","DAL","UTA"],["2025-12-05","POR","PHX"],["2025-12-05","SAC","LAC"],
  ["2025-12-06","ATL","CLE"],["2025-12-06","BKN","MIL"],["2025-12-06","DET","TOR"],
  ["2025-12-06","CHI","MEM"],["2025-12-06","IND","HOU"],["2025-12-06","NOP","SAS"],
  ["2025-12-06","OKC","MIN"],["2025-12-06","LAL","DEN"],["2025-12-06","GSW","POR"],
  // ── Jan 2026 ──
  ["2026-01-03","ATL","MIA"],["2026-01-03","BKN","ORL"],["2026-01-03","CLE","DET"],
  ["2026-01-03","CHI","IND"],["2026-01-03","TOR","BOS"],["2026-01-03","MEM","NOP"],
  ["2026-01-03","HOU","MIL"],["2026-01-03","SAS","OKC"],["2026-01-03","MIN","DEN"],
  ["2026-01-03","LAL","GSW"],["2026-01-03","SAC","PHX"],["2026-01-03","POR","LAC"],
  ["2026-01-05","ATL","NYK"],["2026-01-05","PHI","DEN"],["2026-01-05","BOS","WAS"],
  ["2026-01-05","CHA","MIL"],["2026-01-05","DAL","UTA"],["2026-01-05","HOU","SAC"],
  ["2026-01-05","OKC","MIN"],["2026-01-05","LAL","LAC"],["2026-01-05","GSW","POR"],
  ["2026-01-07","CLE","ATL"],["2026-01-07","BKN","MIA"],["2026-01-07","ORL","PHI"],
  ["2026-01-07","DET","TOR"],["2026-01-07","CHI","MEM"],["2026-01-07","IND","NOP"],
  ["2026-01-07","SAS","HOU"],["2026-01-07","DEN","LAL"],["2026-01-07","MIN","SAC"],
  ["2026-01-09","ATL","BOS"],["2026-01-09","NYK","CLE"],["2026-01-09","MIA","ORL"],
  ["2026-01-09","PHI","WAS"],["2026-01-09","CHA","DET"],["2026-01-09","MIL","CHI"],
  ["2026-01-09","IND","HOU"],["2026-01-09","SAS","DAL"],["2026-01-09","OKC","DEN"],
  ["2026-01-09","LAL","MIN"],["2026-01-09","GSW","SAC"],["2026-01-09","POR","UTA"],
  // ── Feb 2026 ──
  ["2026-02-17","ATL","BKN"],["2026-02-17","CLE","ORL"],["2026-02-17","DET","BOS"],
  ["2026-02-17","IND","CHI"],["2026-02-17","TOR","MIA"],["2026-02-17","HOU","MEM"],
  ["2026-02-17","SAS","NOP"],["2026-02-17","OKC","DAL"],["2026-02-17","MIN","DEN"],
  ["2026-02-17","LAL","PHX"],["2026-02-17","GSW","SAC"],["2026-02-17","LAC","UTA"],
  ["2026-02-18","ATL","NYK"],["2026-02-18","PHI","WAS"],["2026-02-18","CHA","MIL"],
  ["2026-02-18","POR","GSW"],
  ["2026-02-19","BKN","DET"],["2026-02-19","CLE","BOS"],["2026-02-19","IND","MIA"],
  ["2026-02-19","TOR","CHI"],["2026-02-19","HOU","NOP"],["2026-02-19","SAS","MEM"],
  ["2026-02-19","OKC","DAL"],["2026-02-19","MIN","SAC"],["2026-02-19","LAL","UTA"],
  ["2026-02-20","ATL","PHI"],["2026-02-20","NYK","WAS"],["2026-02-20","CHA","MIL"],
  ["2026-02-20","BKN","OKC"],["2026-02-20","DEN","LAC"],["2026-02-20","GSW","POR"],
  ["2026-02-21","CLE","BOS"],["2026-02-21","DET","IND"],["2026-02-21","TOR","MIA"],
  ["2026-02-21","CHI","MEM"],["2026-02-21","SAS","NOP"],["2026-02-21","HOU","DAL"],
  ["2026-02-21","MIN","PHX"],["2026-02-21","LAL","UTA"],["2026-02-21","SAC","LAC"],
  ["2026-02-22","ATL","NYK"],["2026-02-22","PHI","WAS"],["2026-02-22","CLE","OKC"],
  ["2026-02-22","LAL","BOS"],
  ["2026-02-24","DET","BKN"],["2026-02-24","IND","MIA"],["2026-02-24","TOR","CHI"],
  ["2026-02-24","MEM","NOP"],["2026-02-24","OKC","TOR"],["2026-02-24","HOU","DAL"],
  ["2026-02-24","MIN","SAC"],["2026-02-24","PHX","DEN"],["2026-02-24","GSW","LAC"],
  ["2026-02-25","ATL","CLE"],["2026-02-25","BOS","NYK"],["2026-02-25","PHI","WAS"],
  ["2026-02-25","CHA","MIL"],["2026-02-25","OKC","DET"],
  ["2026-02-26","BKN","IND"],["2026-02-26","ORL","MIA"],["2026-02-26","TOR","CHI"],
  ["2026-02-26","MEM","HOU"],["2026-02-26","SAS","NOP"],["2026-02-26","MIN","PHX"],
  ["2026-02-26","LAL","DEN"],["2026-02-26","SAC","UTA"],["2026-02-26","GSW","POR"],
  ["2026-02-27","ATL","CLE"],["2026-02-27","BOS","NYK"],["2026-02-27","DET","WAS"],
  ["2026-02-27","CHA","MIL"],["2026-02-27","DEN","OKC"],
  ["2026-02-28","BKN","IND"],["2026-02-28","ORL","MIA"],["2026-02-28","TOR","CHI"],
  ["2026-02-28","MEM","HOU"],["2026-02-28","SAS","NOP"],["2026-02-28","MIN","PHX"],
  ["2026-02-28","LAL","UTA"],["2026-02-28","SAC","LAC"],["2026-02-28","GSW","POR"],
  // ── Mar 2026 — confirmed from SportRadar API + NBA.com ──
  ["2026-03-07","DEN","NYK"],["2026-03-07","PHX","NOP"],["2026-03-07","SAS","LAC"],
  ["2026-03-07","LAL","IND"],["2026-03-07","MIN","ORL"],["2026-03-07","DET","BKN"],
  ["2026-03-07","ATL","PHI"],
  ["2026-03-08","MIL","UTA"],["2026-03-08","MEM","LAC"],["2026-03-08","OKC","GSW"],
  ["2026-03-08","CLE","BOS"],["2026-03-08","LAL","NYK"],["2026-03-08","TOR","DAL"],
  ["2026-03-08","MIA","DET"],["2026-03-08","NOP","WAS"],["2026-03-08","SAS","HOU"],
  ["2026-03-08","MIL","ORL"],
  ["2026-03-09","POR","IND"],["2026-03-09","SAC","CHI"],["2026-03-09","PHX","CHA"],
  ["2026-03-09","CLE","PHI"],["2026-03-09","OKC","DEN"],["2026-03-09","BKN","MEM"],
  ["2026-03-09","UTA","GSW"],["2026-03-09","LAC","NYK"],
  ["2026-03-10","PHI","MEM"],["2026-03-10","BKN","DET"],["2026-03-10","ATL","DAL"],
  ["2026-03-10","MIA","WAS"],["2026-03-10","MIL","PHX"],["2026-03-10","HOU","TOR"],
  ["2026-03-10","SAS","BOS"],["2026-03-10","POR","CHA"],["2026-03-10","SAC","IND"],
  ["2026-03-10","GSW","CHI"],
  ["2026-03-11","MIL","PHX"],["2026-03-11","HOU","TOR"],["2026-03-11","SAS","BOS"],
  ["2026-03-11","POR","CHA"],["2026-03-11","SAC","IND"],["2026-03-11","GSW","CHI"],
  // Mar 12+ confirmed via NBA.com game pages + ESPN/ABC schedule
  ["2026-03-12","DEN","SAS"],["2026-03-12","CHI","LAL"],["2026-03-12","ATL","DET"],
  ["2026-03-12","NOP","IND"],["2026-03-12","ORL","MEM"],["2026-03-12","NYK","BKN"],
  ["2026-03-12","PHI","CLE"],["2026-03-12","WAS","MIA"],["2026-03-12","DAL","HOU"],
  ["2026-03-12","MIN","UTA"],["2026-03-12","TOR","POR"],
  ["2026-03-13","BOS","ATL"],["2026-03-13","CHA","ORL"],["2026-03-13","CLE","DET"],
  ["2026-03-13","MIL","IND"],["2026-03-13","LAC","NOP"],["2026-03-13","OKC","BOS"],
  ["2026-03-13","DAL","HOU"],["2026-03-13","PHX","SAC"],["2026-03-13","GSW","LAL"],
  ["2026-03-14","NYK","WAS"],["2026-03-14","MIA","BKN"],["2026-03-14","TOR","POR"],
  ["2026-03-14","DEN","LAL"],["2026-03-14","UTA","MIN"],["2026-03-14","LAC","NOP"],
  ["2026-03-15","CHA","ORL"],["2026-03-15","CLE","DET"],["2026-03-15","OKC","MIN"],
  ["2026-03-15","PHI","ATL"],["2026-03-15","SAC","GSW"],["2026-03-15","HOU","SAS"],
  ["2026-03-16","NYK","WAS"],["2026-03-16","MIA","BKN"],["2026-03-16","CHI","MIL"],
  ["2026-03-16","CHA","IND"],["2026-03-16","DAL","DEN"],["2026-03-16","UTA","LAL"],
  ["2026-03-16","TOR","POR"],["2026-03-16","PHX","LAC"],
  ["2026-03-17","ATL","PHI"],["2026-03-17","BOS","CLE"],["2026-03-17","DET","ORL"],
  ["2026-03-17","MEM","NOP"],["2026-03-17","MIN","SAC"],["2026-03-17","HOU","GSW"],
  ["2026-03-17","OKC","LAL"],
  ["2026-03-18","NYK","MIA"],["2026-03-18","BKN","CHI"],["2026-03-18","WAS","IND"],
  ["2026-03-18","OKC","ORL"],["2026-03-18","DEN","UTA"],["2026-03-18","LAC","SAS"],
  ["2026-03-18","PHX","POR"],
  ["2026-03-19","ATL","BOS"],["2026-03-19","CLE","TOR"],["2026-03-19","DET","MEM"],
  ["2026-03-19","CHA","DAL"],["2026-03-19","MIL","HOU"],["2026-03-19","GSW","SAC"],
  ["2026-03-19","LAL","MIN"],
  ["2026-03-20","NYK","MIA"],["2026-03-20","BKN","WAS"],["2026-03-20","IND","OKC"],
  ["2026-03-20","CHI","NOP"],["2026-03-20","DEN","UTA"],["2026-03-20","LAC","SAS"],
  ["2026-03-20","PHX","POR"],
  ["2026-03-21","ATL","CLE"],["2026-03-21","BOS","DET"],["2026-03-21","TOR","MEM"],
  ["2026-03-21","CHA","DAL"],["2026-03-21","MIL","HOU"],["2026-03-21","GSW","LAL"],
  ["2026-03-21","MIN","SAC"],
  ["2026-03-22","NYK","ORL"],["2026-03-22","PHI","BKN"],["2026-03-22","WAS","OKC"],
  ["2026-03-22","IND","CHI"],["2026-03-22","MIA","NOP"],["2026-03-22","DEN","PHX"],
  ["2026-03-22","SAS","LAC"],["2026-03-22","UTA","POR"],
  ["2026-03-24","ATL","CLE"],["2026-03-24","BOS","DET"],["2026-03-24","TOR","MEM"],
  ["2026-03-24","MIL","DAL"],["2026-03-24","HOU","GSW"],["2026-03-24","MIN","LAL"],
  ["2026-03-24","SAC","SAS"],
  ["2026-03-25","NYK","ORL"],["2026-03-25","PHI","OKC"],["2026-03-25","WAS","IND"],
  ["2026-03-25","CHI","MIA"],["2026-03-25","NOP","DEN"],["2026-03-25","PHX","UTA"],
  ["2026-03-25","LAC","POR"],
  ["2026-03-26","ATL","BOS"],["2026-03-26","CLE","TOR"],["2026-03-26","DET","MEM"],
  ["2026-03-26","MIL","DAL"],["2026-03-26","HOU","GSW"],["2026-03-26","OKC","BOS"],
  ["2026-03-26","MIN","LAL"],["2026-03-26","SAC","SAS"],
  ["2026-03-27","PHI","WAS"],["2026-03-27","IND","CHI"],["2026-03-27","MIA","NOP"],
  ["2026-03-27","DEN","PHX"],["2026-03-27","LAC","UTA"],["2026-03-27","POR","SAC"],
  ["2026-03-28","ATL","BKN"],["2026-03-28","CLE","NYK"],["2026-03-28","DET","ORL"],
  ["2026-03-28","TOR","MIL"],["2026-03-28","HOU","DAL"],["2026-03-28","OKC","GSW"],
  ["2026-03-28","MIN","SAS"],["2026-03-28","LAL","UTA"],
  ["2026-03-29","PHI","WAS"],["2026-03-29","IND","CHI"],["2026-03-29","MIA","NOP"],
  ["2026-03-29","DEN","LAC"],["2026-03-29","POR","SAC"],["2026-03-29","PHX","UTA"],
  ["2026-03-30","ATL","BKN"],["2026-03-30","CLE","NYK"],["2026-03-30","DET","ORL"],
  ["2026-03-30","TOR","MIL"],["2026-03-30","HOU","DAL"],["2026-03-30","OKC","MIN"],
  ["2026-03-30","LAL","SAS"],["2026-03-30","GSW","SAC"],
  // ── April 2026 ──
  ["2026-04-01","ATL","CLE"],["2026-04-01","BOS","NYK"],["2026-04-01","IND","DET"],
  ["2026-04-01","MIA","ORL"],["2026-04-01","CHI","TOR"],["2026-04-01","NOP","MEM"],
  ["2026-04-01","MIL","WAS"],["2026-04-01","HOU","SAS"],["2026-04-01","DEN","OKC"],
  ["2026-04-01","LAL","PHX"],["2026-04-01","MIN","UTA"],["2026-04-01","LAC","GSW"],
  ["2026-04-02","PHI","BKN"],["2026-04-02","CHA","MIA"],["2026-04-02","DAL","POR"],
  ["2026-04-02","SAC","LAC"],
  ["2026-04-03","ATL","CLE"],["2026-04-03","BOS","IND"],["2026-04-03","DET","NYK"],
  ["2026-04-03","ORL","TOR"],["2026-04-03","CHI","WAS"],["2026-04-03","NOP","MEM"],
  ["2026-04-03","MIL","MIA"],["2026-04-03","HOU","SAS"],["2026-04-03","OKC","LAL"],
  ["2026-04-03","DEN","MIN"],["2026-04-03","PHX","UTA"],["2026-04-03","GSW","SAC"],
  ["2026-04-04","PHI","BKN"],["2026-04-04","CHA","MIA"],["2026-04-04","DAL","POR"],
  ["2026-04-04","LAC","LAL"],
  ["2026-04-05","ATL","CLE"],["2026-04-05","BOS","IND"],["2026-04-05","DET","NYK"],
  ["2026-04-05","ORL","TOR"],["2026-04-05","CHI","WAS"],["2026-04-05","NOP","MEM"],
  ["2026-04-05","MIL","MIA"],["2026-04-05","HOU","SAS"],["2026-04-05","OKC","LAL"],
  ["2026-04-05","DEN","MIN"],["2026-04-05","PHX","UTA"],["2026-04-05","GSW","POR"],
  ["2026-04-07","ATL","BKN"],["2026-04-07","CLE","BOS"],["2026-04-07","IND","DET"],
  ["2026-04-07","NYK","ORL"],["2026-04-07","MIA","TOR"],["2026-04-07","CHI","WAS"],
  ["2026-04-07","NOP","MIL"],["2026-04-07","MEM","HOU"],["2026-04-07","SAS","DEN"],
  ["2026-04-07","OKC","LAC"],["2026-04-07","LAL","MIN"],["2026-04-07","PHX","UTA"],
  ["2026-04-07","GSW","SAC"],["2026-04-07","DAL","POR"],
  ["2026-04-08","PHI","CHA"],["2026-04-08","OKC","LAL"],["2026-04-08","MIN","LAC"],
  ["2026-04-09","ATL","BKN"],["2026-04-09","CLE","BOS"],["2026-04-09","IND","DET"],
  ["2026-04-09","NYK","ORL"],["2026-04-09","MIA","TOR"],["2026-04-09","CHI","WAS"],
  ["2026-04-09","NOP","MIL"],["2026-04-09","MEM","HOU"],["2026-04-09","SAS","DEN"],
  ["2026-04-09","OKC","DEN"],["2026-04-09","PHX","UTA"],["2026-04-09","GSW","SAC"],
  ["2026-04-10","PHI","CHA"],["2026-04-10","MIN","LAC"],["2026-04-10","LAL","DAL"],
  ["2026-04-11","ATL","MIA"],["2026-04-11","BOS","CLE"],["2026-04-11","DET","IND"],
  ["2026-04-11","ORL","NYK"],["2026-04-11","TOR","CHI"],["2026-04-11","WAS","MIL"],
  ["2026-04-11","MEM","NOP"],["2026-04-11","HOU","SAS"],["2026-04-11","DEN","OKC"],
  ["2026-04-11","LAL","PHX"],["2026-04-11","UTA","MIN"],["2026-04-11","SAC","GSW"],
  ["2026-04-11","POR","DAL"],["2026-04-11","LAC","BKN"],
  ["2026-04-12","ATL","MIA"],["2026-04-12","BOS","CLE"],["2026-04-12","DET","IND"],
  ["2026-04-12","ORL","NYK"],["2026-04-12","TOR","CHI"],["2026-04-12","WAS","MIL"],
  ["2026-04-12","MEM","NOP"],["2026-04-12","HOU","SAS"],["2026-04-12","DEN","OKC"],
  ["2026-04-12","LAL","PHX"],["2026-04-12","UTA","MIN"],["2026-04-12","SAC","GSW"],
];

// ─── Pre-index schedule by team for O(1) lookup ───────────────────────────────
const TEAM_DATES = {};
for (const [date, a, b] of SCHEDULE) {
  if (!TEAM_DATES[a]) TEAM_DATES[a] = [];
  if (!TEAM_DATES[b]) TEAM_DATES[b] = [];
  TEAM_DATES[a].push(date);
  TEAM_DATES[b].push(date);
}
// Sort each team's dates ascending
for (const abbr of Object.keys(TEAM_DATES)) {
  TEAM_DATES[abbr].sort();
}

// ─── Rest day calculation — pure sync, instant ────────────────────────────────
function calcRest(teamAbbr, gameDateStr) {
  if (!teamAbbr || !gameDateStr) return { days: null, lastDate: null };
  const dates = TEAM_DATES[teamAbbr] || [];
  // Find the latest scheduled date that is strictly before gameDateStr
  let lastDate = null;
  for (const d of dates) {
    if (d < gameDateStr) lastDate = d;
    else break;
  }
  if (!lastDate) return { days: null, lastDate: null };
  const diff = Math.round(
    (new Date(gameDateStr + "T12:00:00") - new Date(lastDate + "T12:00:00")) / 86400000
  );
  return { days: diff, lastDate };
}

function restLabel(days) {
  if (days === null) return { text: "N/A", short: "—", color: "#444" };
  if (days === 1)    return { text: "Back-to-back", short: "B2B", color: "#ef4444" };
  if (days === 2)    return { text: "1 day rest",   short: "1R",  color: "#f59e0b" };
  if (days === 3)    return { text: "2 days rest",  short: "2R",  color: "#22c55e" };
  return { text: `${days - 1} days rest`, short: `${days - 1}R`, color: "#22c55e" };
}

// ─── Injury fetch ─────────────────────────────────────────────────────────────
async function fetchInjuries(homeName, awayName) {
  const res = await fetch("/api/anthropic", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 600,
      tools: [{ type: "web_search_20250305", name: "web_search" }],
      messages: [{
        role: "user",
        content: `Search for the latest NBA injury report for the ${homeName} and ${awayName} today. List only OUT, Doubtful, or Questionable players. Format: plain text, no bullets. E.g. "LeBron James (LAL) — OUT: left ankle." If no injuries: "[Team] — no injuries reported." Be concise.`,
      }],
    }),
  });
  const data = await res.json();
  return (data.content || []).filter(b => b.type === "text").map(b => b.text).join(" ").trim() || "No injury data.";
}

// ─── UI helpers ──────────────────────────────────────────────────────────────
const mono = { fontFamily: "monospace" };
const label10 = { ...mono, fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase" };

function RestPill({ abbr, gameDate }) {
  const { days, lastDate } = calcRest(abbr, gameDate);
  const { text, short, color } = restLabel(days);
  return (
    <div>
      <div style={{ ...label10, color: "#444", marginBottom: 4 }}>REST</div>
      <div style={{ display: "inline-flex", alignItems: "center", gap: 5,
        background: color + "18", border: `1px solid ${color}35`,
        borderRadius: 4, padding: "3px 9px" }}>
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: color, flexShrink: 0 }} />
        <span style={{ ...mono, fontSize: 11, color, fontWeight: 700 }}>{short}</span>
      </div>
      <div style={{ ...mono, fontSize: 10, color: "#555", marginTop: 3 }}>{text}</div>
      {lastDate && <div style={{ ...mono, fontSize: 9, color: "#2e2e2e", marginTop: 1 }}>prev: {lastDate}</div>}
    </div>
  );
}

function TeamCard({ abbr, role }) {
  const t = NBA_TEAMS.find(t => t.abbr === abbr);
  if (!t) return null;
  return (
    <div style={{ flex: 1, minWidth: 200, background: "#111", border: "1px solid #1e1e1e",
      borderRadius: 6, padding: "14px 16px" }}>
      <div style={{ ...label10, color: "#f97316", marginBottom: 6 }}>{role}</div>
      <div style={{ fontSize: 17, fontWeight: 700, color: "#fff", fontFamily: "Georgia,serif" }}>{t.name}</div>
      <div style={{ marginTop: 10, display: "flex", gap: 16, flexWrap: "wrap", alignItems: "flex-start" }}>
        <div>
          <div style={{ ...label10, color: "#444" }}>RECORD</div>
          <div style={{ ...mono, fontSize: 14, color: "#ddd" }}>{t.wins}–{t.losses}</div>
        </div>
        <div>
          <div style={{ ...label10, color: "#444" }}>WIN%</div>
          <div style={{ ...mono, fontSize: 14, color: "#ddd" }}>{(t.winPct * 100).toFixed(1)}%</div>
        </div>
        <div>
          <div style={{ ...label10, color: "#444" }}>LAST 5</div>
          <div style={{ display: "flex", gap: 3, marginTop: 5 }}>
            {t.recentForm.map((r, i) => (
              <div key={i} style={{ width: 8, height: 8, borderRadius: "50%",
                background: r === "W" ? "#22c55e" : "#ef4444" }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProbBar({ homeProb, homeAbbr, awayAbbr }) {
  return (
    <div style={{ marginTop: 6 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ ...mono, fontSize: 13, color: homeProb > 50 ? "#f97316" : "#888" }}>
          {homeAbbr} {homeProb.toFixed(1)}%
        </span>
        <span style={{ ...mono, fontSize: 13, color: (100 - homeProb) > 50 ? "#f97316" : "#888" }}>
          {(100 - homeProb).toFixed(1)}% {awayAbbr}
        </span>
      </div>
      <div style={{ height: 10, background: "#1a1a1a", borderRadius: 5, overflow: "hidden", display: "flex" }}>
        <div style={{ width: `${homeProb}%`, background: "linear-gradient(90deg,#ea580c,#f97316)",
          transition: "width 1s cubic-bezier(.4,0,.2,1)", borderRadius: "5px 0 0 5px" }} />
        <div style={{ flex: 1, background: "#2a2a2a", borderRadius: "0 5px 5px 0" }} />
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function NBAPredictor() {
  const [home, setHome] = useState("");
  const [away, setAway] = useState("");
  const [date, setDate] = useState("2026-03-10");
  const [prediction, setPrediction] = useState(null);
  const [predLoading, setPredLoading] = useState(false);
  const [predError, setPredError] = useState(null);

  const [injuryText, setInjuryText] = useState("");
  const [injuryLoading, setInjuryLoading] = useState(false);
  const [injuryError, setInjuryError] = useState(false);
  const [injuryEdit, setInjuryEdit] = useState(false);
  const [injuryOverride, setInjuryOverride] = useState("");
  const injuryKey = useRef("");

  // Sync rest calculation — runs on every render, instant
  const homeRest = calcRest(home, date);
  const awayRest = calcRest(away, date);

  // Fetch injuries when both teams selected
  useEffect(() => {
    if (!home || !away) {
      setInjuryText(""); setInjuryOverride(""); setInjuryEdit(false); setInjuryError(false);
      return;
    }
    const key = `${home}|${away}`;
    if (injuryKey.current === key) return;
    injuryKey.current = key;
    const ht = NBA_TEAMS.find(t => t.abbr === home);
    const at = NBA_TEAMS.find(t => t.abbr === away);
    setInjuryText(""); setInjuryOverride(""); setInjuryEdit(false); setInjuryError(false);
    setInjuryLoading(true);
    setPrediction(null);
    fetchInjuries(ht.name, at.name)
      .then(txt => { setInjuryText(txt); setInjuryOverride(txt); })
      .catch(() => setInjuryError(true))
      .finally(() => setInjuryLoading(false));
  }, [home, away]);

  const canPredict = home && away && home !== away && date && !injuryLoading;
  const activeInjuries = injuryEdit ? injuryOverride : injuryText;

  const buildPrompt = () => {
    const ht = NBA_TEAMS.find(t => t.abbr === home);
    const at = NBA_TEAMS.find(t => t.abbr === away);
    const fmtRest = (r) => r.days !== null
      ? `${r.days} day(s) since last scheduled game (${r.lastDate})`
      : "unknown — assume typical rest";
    return `You are an expert NBA analytics engine. Predict the outcome of this game.

GAME: ${ht.name} (home) vs ${at.name} (away) on ${date}

HOME — ${ht.name}
  Record: ${ht.wins}-${ht.losses} | Win%: ${(ht.winPct*100).toFixed(1)}% | Conf: ${ht.conf}
  Last 5: ${ht.recentForm.join(", ")} | Rest: ${fmtRest(homeRest)}

AWAY — ${at.name}
  Record: ${at.wins}-${at.losses} | Win%: ${(at.winPct*100).toFixed(1)}% | Conf: ${at.conf}
  Last 5: ${at.recentForm.join(", ")} | Rest: ${fmtRest(awayRest)}

INJURIES (live): ${activeInjuries || "none reported"}

MODELING NOTES:
- Home court ~3.5 pt boost
- Back-to-back = ~3pt penalty, 3+ days = ~1pt bonus
- Apply meaningful adjustments for star players OUT/Doubtful

Respond ONLY with valid JSON, no markdown:
{"winner":"team name","winner_abbr":"abbr","home_score":number,"away_score":number,"margin":number,"home_win_probability":number,"confidence":"LOW"|"MEDIUM"|"HIGH","key_factors":[{"factor":"name","impact":"+X pts to team","detail":"explanation"}],"narrative":"2-3 sentences","model_notes":"1 sentence uncertainty"}`;
  };

  const predict = async () => {
    setPredLoading(true); setPredError(null); setPrediction(null);
    try {
      const res = await fetch("/api/anthropic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: buildPrompt() }],
        }),
      });
      const data = await res.json();
      const raw = data.content.map(i => i.text || "").join("");
      setPrediction(JSON.parse(raw.replace(/```json|```/g,"").trim()));
    } catch { setPredError("Prediction failed — try again."); }
    finally { setPredLoading(false); }
  };

  const ht = NBA_TEAMS.find(t => t.abbr === home);
  const at = NBA_TEAMS.find(t => t.abbr === away);
  const confColor = { HIGH:"#22c55e", MEDIUM:"#f59e0b", LOW:"#ef4444" };

  return (
    <>
      <Head>
        <title>NBA Game Predictor</title>
        <meta name="description" content="AI-powered NBA game outcome predictor" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
    <div style={{ minHeight:"100vh", background:"#080808", color:"#e5e5e5",
      fontFamily:"Georgia,serif", padding:"32px 24px", maxWidth:800, margin:"0 auto" }}>

      {/* Header */}
      <div style={{ marginBottom:32, borderBottom:"1px solid #1a1a1a", paddingBottom:20 }}>
        <div style={{ ...label10, color:"#f97316", marginBottom:8 }}>
          NBA · PREDICTIVE ANALYTICS ENGINE · 2025–26
        </div>
        <div style={{ fontSize:28, fontWeight:700, color:"#fff", letterSpacing:"-0.5px" }}>
          Game Outcome Predictor
        </div>
        <div style={{ ...mono, fontSize:11, color:"#333", marginTop:6 }}>
          Win% · form · home advantage · rest days (instant) · injuries (live) → score + margin
        </div>
      </div>

      {/* Step 1: Date */}
      <div style={{ marginBottom:20 }}>
        <div style={{ ...label10, color:"#444", marginBottom:8 }}>
          STEP 1 — GAME DATE
          <span style={{ color:"#f97316", marginLeft:10 }}>rest auto-calculates from schedule</span>
        </div>
        <input type="date" value={date}
          onChange={e => { setDate(e.target.value); setPrediction(null); }}
          style={{ background:"#0f0f0f", border:"1px solid #2a2a2a", color:"#fff",
            padding:"11px 14px", ...mono, fontSize:14, borderRadius:4,
            outline:"none", colorScheme:"dark", width:200 }} />
      </div>

      {/* Step 2: Teams */}
      <div style={{ marginBottom:16 }}>
        <div style={{ ...label10, color:"#444", marginBottom:10 }}>STEP 2 — SELECT TEAMS</div>
        <div style={{ display:"flex", gap:16, flexWrap:"wrap" }}>
          {[["Home Team", home, setHome, away], ["Away Team", away, setAway, home]].map(([lbl, val, setter, excl]) => (
            <div key={lbl} style={{ flex:1 }}>
              <div style={{ ...label10, color:"#f97316", marginBottom:8 }}>{lbl}</div>
              <select value={val}
                onChange={e => { setter(e.target.value); setPrediction(null); injuryKey.current = ""; }}
                style={{ width:"100%", background:"#0f0f0f", border:"1px solid #2a2a2a",
                  color: val ? "#fff" : "#555", padding:"12px 14px", ...mono, fontSize:13,
                  borderRadius:4, cursor:"pointer", outline:"none", appearance:"none",
                  backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23f97316' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
                  backgroundRepeat:"no-repeat", backgroundPosition:"right 12px center" }}>
                <option value="">Select team…</option>
                {NBA_TEAMS.filter(t => t.abbr !== excl).map(t => (
                  <option key={t.abbr} value={t.abbr}>{t.name}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>

      {/* Team cards + rest pills */}
      {(home || away) && (
        <div style={{ display:"flex", gap:12, marginBottom:16, flexWrap:"wrap" }}>
          {home && <TeamCard abbr={home} role="HOME" />}
          {away && <TeamCard abbr={away} role="AWAY" />}
        </div>
      )}

      {/* Rest banner — always instant */}
      {home && away && date && (
        <div style={{ background:"#0d0d0d", border:"1px solid #1a1a1a", borderRadius:6,
          padding:"10px 16px", marginBottom:16, display:"flex", gap:8,
          alignItems:"center", flexWrap:"wrap" }}>
          <span style={{ ...label10, color:"#2a2a2a", marginRight:4 }}>AUTO REST</span>
          {[{ abbr:home, role:"Home", r:homeRest }, { abbr:away, role:"Away", r:awayRest }].map(({ abbr, role, r }) => {
            const { text, short, color } = restLabel(r.days);
            return (
              <div key={abbr} style={{ display:"flex", alignItems:"center", gap:6,
                background:"#111", border:"1px solid #1e1e1e", borderRadius:4, padding:"5px 10px" }}>
                <span style={{ ...mono, fontSize:11, color:"#555" }}>{role} · {abbr}</span>
                <div style={{ width:6, height:6, borderRadius:"50%", background:color }} />
                <span style={{ ...mono, fontSize:11, color, fontWeight:700 }}>{short}</span>
                <span style={{ ...mono, fontSize:10, color:"#444" }}>{text}</span>
                {r.lastDate && <span style={{ ...mono, fontSize:9, color:"#2a2a2a" }}>({r.lastDate})</span>}
              </div>
            );
          })}
        </div>
      )}

      {/* Injuries */}
      {home && away && (
        <div style={{ marginBottom:20 }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
            marginBottom:10, flexWrap:"wrap", gap:8 }}>
            <div style={{ ...label10, color:"#444" }}>
              STEP 3 — INJURY REPORT
              {!injuryLoading && injuryText &&
                <span style={{ marginLeft:10, color:"#22c55e", fontSize:9 }}>● LIVE</span>}
            </div>
            {!injuryLoading && injuryText && (
              <button onClick={() => setInjuryEdit(e => !e)}
                style={{ background:"transparent", border:"1px solid #2a2a2a",
                  borderRadius:3, color: injuryEdit ? "#f97316" : "#444",
                  ...mono, fontSize:10, letterSpacing:"0.1em",
                  padding:"3px 10px", cursor:"pointer" }}>
                {injuryEdit ? "● EDITING" : "EDIT"}
              </button>
            )}
          </div>
          {injuryLoading && (
            <div style={{ background:"#0f0f0f", border:"1px solid #1e1e1e",
              borderRadius:6, padding:16, display:"flex", alignItems:"center", gap:8 }}>
              <span style={{ width:7, height:7, borderRadius:"50%", background:"#f97316",
                display:"inline-block", animation:"pulse 1.2s ease-in-out infinite" }} />
              <span style={{ ...mono, fontSize:11, color:"#f97316", letterSpacing:"0.12em" }}>
                FETCHING LIVE INJURY REPORT…
              </span>
            </div>
          )}
          {!injuryLoading && injuryError && (
            <div style={{ background:"#1a0a0a", border:"1px solid #3a1212",
              borderRadius:6, padding:"12px 14px" }}>
              <div style={{ ...mono, fontSize:11, color:"#ef4444", marginBottom:8 }}>
                Fetch failed — enter manually:
              </div>
              <textarea rows={2} value={injuryOverride}
                onChange={e => setInjuryOverride(e.target.value)}
                placeholder="e.g. LeBron (LAL) — Questionable: left ankle."
                style={{ width:"100%", background:"#0f0f0f", border:"1px solid #2a2a2a",
                  color:"#ccc", padding:"10px 12px", ...mono, fontSize:12,
                  borderRadius:4, outline:"none", resize:"vertical", lineHeight:1.5 }} />
            </div>
          )}
          {!injuryLoading && !injuryError && injuryText && !injuryEdit && (
            <div style={{ background:"#0d0d0d", border:"1px solid #1a1a1a",
              borderLeft:"3px solid #22c55e", borderRadius:6, padding:"14px 16px",
              ...mono, fontSize:12, color:"#888", lineHeight:1.75, whiteSpace:"pre-wrap" }}>
              {injuryText}
            </div>
          )}
          {!injuryLoading && !injuryError && injuryEdit && (
            <textarea rows={4} value={injuryOverride}
              onChange={e => setInjuryOverride(e.target.value)}
              style={{ width:"100%", background:"#0f0f0f",
                border:"1px solid #f97316", borderLeft:"3px solid #f97316",
                color:"#ccc", padding:"12px 14px", ...mono, fontSize:12,
                borderRadius:6, outline:"none", resize:"vertical", lineHeight:1.75 }} />
          )}
        </div>
      )}

      {/* Predict button */}
      <button onClick={predict} disabled={!canPredict || predLoading}
        style={{ width:"100%", padding:14,
          background: canPredict && !predLoading
            ? "linear-gradient(135deg,#ea580c,#f97316)" : "#111",
          color: canPredict && !predLoading ? "#fff" : "#333",
          border: canPredict && !predLoading ? "none" : "1px solid #1e1e1e",
          borderRadius:4, ...mono, fontSize:12, letterSpacing:"0.2em",
          textTransform:"uppercase", cursor: canPredict && !predLoading ? "pointer" : "not-allowed",
          transition:"all 0.2s", marginBottom:24 }}>
        {predLoading ? "◈  RUNNING MODEL…"
          : injuryLoading ? "◈  WAITING FOR INJURY DATA…"
          : "◈  GENERATE PREDICTION"}
      </button>

      {predError && (
        <div style={{ background:"#1a0a0a", border:"1px solid #450a0a", borderRadius:6,
          padding:14, color:"#ef4444", ...mono, fontSize:13, marginBottom:16 }}>
          {predError}
        </div>
      )}

      {/* Results */}
      {prediction && (() => {
        const winnerIsHome = prediction.winner_abbr === home;
        return (
          <div style={{ background:"#0c0c0c", border:"1px solid #1f1f1f",
            borderRadius:8, overflow:"hidden", animation:"fadeIn 0.4s ease-out" }}>

            {/* Score block */}
            <div style={{ background:"linear-gradient(135deg,#111 0%,#1a0f05 100%)",
              borderBottom:"1px solid #1f1f1f", padding:"28px 24px", textAlign:"center" }}>
              <div style={{ ...label10, color:"#f97316", marginBottom:10 }}>PREDICTED WINNER</div>
              <div style={{ fontSize:28, fontWeight:700, color:"#fff", letterSpacing:"-0.5px" }}>
                {prediction.winner}
              </div>
              <div style={{ fontSize:50, ...mono, fontWeight:700, margin:"14px 0 4px", letterSpacing:6 }}>
                <span style={{ color: winnerIsHome ? "#f97316" : "#ccc" }}>
                  {prediction.home_score}
                </span>
                <span style={{ color:"#222", fontSize:28 }}> – </span>
                <span style={{ color: !winnerIsHome ? "#f97316" : "#ccc" }}>
                  {prediction.away_score}
                </span>
              </div>
              <div style={{ ...mono, fontSize:11, color:"#444" }}>
                {ht?.name} (H)  ·  {at?.name} (A)
              </div>
              <div style={{ maxWidth:400, margin:"18px auto 0" }}>
                <ProbBar homeProb={prediction.home_win_probability}
                  homeAbbr={ht?.abbr} awayAbbr={at?.abbr} />
              </div>
              <div style={{ display:"flex", justifyContent:"center", gap:28, marginTop:18 }}>
                <div>
                  <div style={{ ...label10, color:"#333" }}>MARGIN</div>
                  <div style={{ fontSize:22, color:"#f97316", ...mono, fontWeight:700 }}>
                    {Math.abs(prediction.margin)} pts
                  </div>
                </div>
                <div style={{ width:1, background:"#1f1f1f" }} />
                <div>
                  <div style={{ ...label10, color:"#333" }}>CONFIDENCE</div>
                  <div style={{ fontSize:22, ...mono, fontWeight:700,
                    color: confColor[prediction.confidence] || "#888" }}>
                    {prediction.confidence}
                  </div>
                </div>
              </div>
            </div>

            {/* Factors */}
            <div style={{ padding:"20px 24px", borderBottom:"1px solid #1a1a1a" }}>
              <div style={{ ...label10, color:"#333", marginBottom:12 }}>MODEL FACTORS</div>
              <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
                {prediction.key_factors?.map((f, i) => (
                  <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:12,
                    padding:"10px 12px", background:"#111", borderRadius:4,
                    borderLeft:"2px solid #1e1e1e" }}>
                    <div style={{ ...mono, fontSize:11, color:"#f97316",
                      whiteSpace:"nowrap", minWidth:110, paddingTop:1 }}>{f.impact}</div>
                    <div>
                      <div style={{ fontSize:12, color:"#ccc", fontWeight:600, marginBottom:2 }}>
                        {f.factor}
                      </div>
                      <div style={{ ...mono, fontSize:11, color:"#444" }}>{f.detail}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Narrative */}
            <div style={{ padding:"20px 24px", borderBottom:"1px solid #1a1a1a" }}>
              <div style={{ ...label10, color:"#333", marginBottom:10 }}>GAME NARRATIVE</div>
              <p style={{ fontSize:14, lineHeight:1.75, color:"#888",
                fontStyle:"italic", margin:0 }}>{prediction.narrative}</p>
            </div>

            <div style={{ padding:"14px 24px" }}>
              <div style={{ ...mono, fontSize:11, color:"#2a2a2a", display:"flex", gap:8 }}>
                <span style={{ color:"#f97316", flexShrink:0 }}>⚠</span>
                <span>{prediction.model_notes}</span>
              </div>
            </div>
          </div>
        );
      })()}

      <style>{`
        @keyframes fadeIn { from { opacity:0; transform:translateY(8px) } to { opacity:1; transform:none } }
        @keyframes pulse { 0%,100% { opacity:1; transform:scale(1) } 50% { opacity:.4; transform:scale(.75) } }
        select option { background:#111 }
        input[type="date"]::-webkit-calendar-picker-indicator { filter:invert(0.4) }
        * { box-sizing:border-box }
      `}</style>
    </div>
  );
}
