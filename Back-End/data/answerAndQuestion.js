let answerAndQuestion = [
  {
    question: `Tell me about your journey into IT - what sparked your interest, and which programming languages have you started learning?`,
    answer: `I’ve always been curious about how things work, especially computers and software. My journey into IT really took off when I took a basic computer science class in high school. I loved the idea of creating something from scratch, and that’s when I started learning programming. I began with Python because it seemed beginner-friendly, and I liked that I could use it for various projects. After that, I dabbled in HTML and CSS to create simple websites. Recently, I’ve started exploring JavaScript, as I want to make my web projects more interactive. Overall, my interest just keeps growing as I learn more!`,
  },
  {
    question: `In our industry, technology evolves rapidly. Can you share a recent tech trend you've adopted and how you've applied it in your work?`,
    answer: `One tech trend that I’ve recently adopted is the use of cloud services, specifically AWS. I read a lot about how businesses are moving to the cloud for better scalability and flexibility. At my current job, we were facing issues with our local server capacity, so I suggested we try migrating some of our applications to AWS. I helped set up a few services like S3 for storage and EC2 for hosting. It was a bit of a learning curve, but I found a lot of online tutorials that guided me through the process. Now, we’re able to handle more traffic without worrying about server overload!.`,
  },
  {
    question: `Let's discuss a challenging situation - walk me through a time when you encountered a system failure. What steps did you take to resolve it, and how did you ensure it wouldn't happen again?`,
    answer: `There was this one time when our main website went down during a peak traffic period, and it was really stressful. I quickly checked our server logs and found that we had hit a resource limit. To resolve it, I coordinated with our IT team to restart the server and temporarily redirected traffic to a backup site. Once we got everything back online, I suggested we implement monitoring tools to keep track of our server performance in real-time. We also decided to upgrade our hosting plan to handle more traffic. Since then, we’ve had fewer issues, and I feel more prepared for any future challenges!.`,
  },
];

module.exports = { answerAndQuestion };
