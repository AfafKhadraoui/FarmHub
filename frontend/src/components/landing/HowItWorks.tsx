import Image from "next/image";

interface Step {
  id: number;
  number: string;
  title: string;
  description: string;
}

export default function HowItWorks() {
  const steps: Step[] = [
    {
      id: 1,
      number: "1",
      title: "Create Your Farm",
      description:
        "Sign up and set up your farm profile. Add farm name, location, and get your unique farm code instantly.",
    },
    {
      id: 2,
      number: "2",
      title: "Invite Your Team",
      description:
        "Share your farm code with workers. They register using the code and join your farm automatically. No approvals needed.",
    },
    {
      id: 3,
      number: "3",
      title: "Start Managing",
      description:
        "Map your fields, assign tasks to workers, and track progress in real-time. Monitor weather and optimize operations.",
    },
  ];

  return (
    <section id="how-it-works" className="w-full bg-[#f8f7f0] py-16 md:py-24">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Header */}
        <p className="text-lg sm:text-xl text-[#eec044] font-covered">
          How it works
        </p>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#1f1e17] mt-2">
          Get Started in 3 Simple Steps
        </h2>

        {/* Steps */}
        <div className="mt-12 md:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-6 md:gap-10">
          {steps.map((step) => (
            <div
              key={step.id}
              className="flex flex-col items-center text-center px-4"
            >
              {/* Step Number */}
              <div className="flex justify-center items-center w-20 h-20 md:w-24 md:h-24 bg-[#4baf47] rounded-full shadow-md mb-6">
                <p className="text-3xl md:text-4xl font-extrabold text-white font-sans">
                  {step.number}
                </p>
              </div>

              {/* Step Text */}
              <h3 className="text-xl md:text-2xl font-extrabold text-[#1f1e17] mb-2">
                {step.title}
              </h3>
              <p className="text-[#878680] text-sm md:text-base leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
