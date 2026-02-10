---
title: "Learning Next.js with Claude Code: A 25-Year Dev's Perspective"
date: "2025-01-15"
excerpt: "After 25 years of building web apps — from ColdFusion to jQuery to React — I'm diving into Next.js with an AI pair programmer. Here's what I've learned so far."
category: "Learning"
tags: ["nextjs", "claude-code", "learning", "web-development"]
---

After 25 years in the game, you'd think learning a new framework would feel routine. It doesn't. Every time I pick up something new, there's that familiar mix of excitement and "what have I gotten myself into?"

## Why Next.js?

I've been building web applications since ColdFusion was the hot new thing. I've ridden every wave — PHP, jQuery, Angular, React. Each time, the jump felt massive. But this time something is different: I have an AI pair programmer helping me along.

## The ColdFusion to Next.js Pipeline

Here's the thing about being a ColdFusion developer learning modern JavaScript frameworks — the *concepts* aren't that different:

- **Server-side rendering?** ColdFusion did that before it was cool
- **Component-based architecture?** We had custom tags
- **API routes?** We had CFCs as web services

The syntax is wildly different, but the mental models transfer more than you'd expect.

## Claude Code as a Learning Tool

What's genuinely blown my mind is using Claude Code as a learning partner. It's not just writing code for me — it's explaining *why* things work the way they do. When I ask "why does this component re-render?", I get an explanation that connects to concepts I already understand.

```javascript
// This pattern felt familiar immediately
// It's just a ColdFusion custom tag with better syntax
export default function ProjectCard({ title, description, link }) {
  return (
    <div className="card">
      <h3>{title}</h3>
      <p>{description}</p>
      <a href={link}>View Project</a>
    </div>
  );
}
```

## Start Small, Iterate Fast

My approach to learning anything new: build something real, keep it small, ship it, improve it. This portfolio site is my learning project. Every feature I add teaches me something new about Next.js, Tailwind, and modern web development.

## What's Next

I'm planning to add more interactive features, maybe some cycling data visualizations from Strava. But for now — I shipped something. And that's always the hardest part.

*Start small. Iterate fast. Ship it.*
