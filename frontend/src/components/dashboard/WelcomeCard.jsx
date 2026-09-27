export default function WelcomeCard({ user }) {
  const firstName = user?.name?.split(" ")[0] || "User";

  return (
    <div className="text-white">
      <h1 className="mt-3 text-5xl font-bold tracking-tight">
        👋 Welcome back, {firstName}!
      </h1>

      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-blue-100">
        Manage your job applications, prepare for interviews, track your
        progress, and stay focused on landing your dream opportunity.
      </p>
    </div>
  );
}