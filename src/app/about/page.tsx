'use client';
import Link from 'next/link';

export default function About() {
  const features = [
    {
      title: "Diverse Quiz Categories",
      description: "From history to science, mathematics to literature, we offer quizzes across numerous subjects.",
      icon: "🧠"
    },
    {
      title: "Competitive Leaderboards",
      description: "Track your progress and compete with friends to see who can reach the top of our global rankings.",
      icon: "🏆"
    },
    {
      title: "Timed Challenges",
      description: "Test your knowledge under pressure with our timed quiz sessions that keep you on your toes.",
      icon: "⏱️"
    },
    {
      title: "Learning-Focused",
      description: "Each quiz is designed not just to test but to teach, with explanations for each answer.",
      icon: "📚"
    }
  ];

  // const team = [
  //   {
  //     name: "Alex Morgan",
  //     role: "Founder & Quiz Creator",
  //     bio: "Former teacher with a passion for making learning fun and accessible."
  //   },
  //   {
  //     name: "Jamie Rodriguez",
  //     role: "Lead Developer",
  //     bio: "Full-stack developer who built Go Quiz from the ground up with modern web technologies."
  //   },
  //   {
  //     name: "Sam Taylor",
  //     role: "Content Specialist",
  //     bio: "Researcher and writer who ensures all our quiz content is accurate and engaging."
  //   }
  // ];
  //
  return (
    //aise dekh go to /about and vaha dark mode toggel karke dek
    <div className="min-h-screen py-12 px-4 dark:bg-amber-900" >
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4" style={{ color: "#3C3E40" }}>
            About Go Quiz
          </h1>
          <p className="text-xl max-w-2xl mx-auto" style={{ color: "#6E7073" }}>
            Your destination for knowledge challenges, brain teasers, and educational fun.
          </p>
        </div>

        {/* Mission Statement */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-12">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center text-4xl"
              style={{ backgroundColor: "#D97904", color: "white" }}
            >
              🎯
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-4" style={{ color: "#3C3E40" }}>Our Mission</h2>
              <p className="text-lg leading-relaxed" style={{ color: "#6E7073" }}>
                At Go Quiz, we believe learning should be fun, engaging, and accessible to everyone.
                Our mission is to create a platform that challenges minds, sparks curiosity, and
                builds knowledge through the joy of quizzing.
              </p>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <h2 className="text-2xl font-bold mb-8 text-center" style={{ color: "#3C3E40" }}>
          What Makes Go Quiz Special
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-md border-l-4"
              style={{ borderLeftColor: "#D97904" }}
            >
              <div className="flex items-start gap-4">
                <div className="text-3xl">{feature.icon}</div>
                <div>
                  <h3 className="text-lg font-semibold mb-2" style={{ color: "#3C3E40" }}>
                    {feature.title}
                  </h3>
                  <p style={{ color: "#6E7073" }}>
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Team Section */}
        {/* <h2 className="text-2xl font-bold mb-8 text-center" style={{ color: "#3C3E40" }}> */}
        {/*   Meet Our Team */}
        {/* </h2> */}
        {/**/}
        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"> */}
        {/*   {team.map((member, index) => ( */}
        {/*     <div */}
        {/*       key={index} */}
        {/*       className="bg-white p-6 rounded-xl shadow-md text-center" */}
        {/*     > */}
        {/*       <div */}
        {/*         className="w-16 h-16 mx-auto rounded-full mb-4 flex items-center justify-center text-xl" */}
        {/*         style={{ backgroundColor: "#F2F2F2", color: "#3C3E40" }} */}
        {/*       > */}
        {/*         {member.name.charAt(0)} */}
        {/*       </div> */}
        {/*       <h3 className="text-lg font-semibold mb-1" style={{ color: "#3C3E40" }}> */}
        {/*         {member.name} */}
        {/*       </h3> */}
        {/*       <p className="text-sm mb-3" style={{ color: "#D97904" }}> */}
        {/*         {member.role} */}
        {/*       </p> */}
        {/*       <p className="text-sm" style={{ color: "#6E7073" }}> */}
        {/*         {member.bio} */}
        {/*       </p> */}
        {/*     </div> */}
        {/*   ))} */}
        {/* </div> */}

        {/* Get Started CTA */}
        <div
          className="text-center p-8 rounded-xl mb-8"
          style={{ backgroundColor: "#3C3E40" }}
        >
          <h2 className="text-2xl font-bold mb-4 text-white">
            Ready to Challenge Yourself?
          </h2>
          <p className="text-lg mb-6 text-gray-300">
            Join thousands of users who are expanding their knowledge every day.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="px-6 py-3 rounded-lg font-medium transition-all"
              style={{ backgroundColor: "#D97904", color: "white" }}
            >
              Explore Quizzes
            </Link>
            <Link
              href="/leaderboard"
              className="px-6 py-3 rounded-lg font-medium transition-all"
              style={{ backgroundColor: "rgba(255, 255, 255, 0.2)", color: "white" }}
            >
              View Leaderboard
            </Link>
          </div>
        </div>

        {/* FAQ Section */}
        <h2 className="text-2xl font-bold mb-6 text-center" style={{ color: "#3C3E40" }}>
          Frequently Asked Questions
        </h2>

        <div className="bg-white rounded-xl shadow-md p-6 mb-12">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: "#3C3E40" }}>
                How do I create an account?
              </h3>
              <p style={{ color: "#6E7073" }}>
                Click the "Sign Up" button in the top-right corner and follow the prompts to create your Go Quiz account.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: "#3C3E40" }}>
                Are the quizzes free to play?
              </h3>
              <p style={{ color: "#6E7073" }}>
                Yes! All quizzes are completely free. We believe knowledge should be accessible to everyone.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: "#3C3E40" }}>
                How are points calculated?
              </h3>
              <p style={{ color: "#6E7073" }}>
                You earn points on how fast do you submit answers in the quiz!
              </p>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        {/* <div className="text-center"> */}
        {/*   <h2 className="text-xl font-bold mb-4" style={{ color: "#3C3E40" }}> */}
        {/*     Have Questions? */}
        {/*   </h2> */}
        {/*   <p className="mb-6" style={{ color: "#6E7073" }}> */}
        {/*     We'd love to hear from you! Reach out to our team at <span className="font-medium">contact@goquiz.com</span> */}
        {/*   </p> */}
        {/*   <div className="flex justify-center gap-4"> */}
        {/*     <a */}
        {/*       href="#" */}
        {/*       className="w-10 h-10 rounded-full flex items-center justify-center" */}
        {/*       style={{ backgroundColor: "#6E7073", color: "white" }} */}
        {/*     > */}
        {/*       🔗 */}
        {/*     </a> */}
        {/*     <a */}
        {/*       href="#" */}
        {/*       className="w-10 h-10 rounded-full flex items-center justify-center" */}
        {/*       style={{ backgroundColor: "#6E7073", color: "white" }} */}
        {/*     > */}
        {/*       📱 */}
        {/*     </a> */}
        {/*     <a */}
        {/*       href="#" */}
        {/*       className="w-10 h-10 rounded-full flex items-center justify-center" */}
        {/*       style={{ backgroundColor: "#6E7073", color: "white" }} */}
        {/*     > */}
        {/*       📧 */}
        {/*     </a> */}
        {/*   </div> */}
        {/* </div> */}
      </div>
    </div >
  );
}
