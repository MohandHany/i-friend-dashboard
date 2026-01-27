import IFriendSpinner from "@/components/ifriend-spinner";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-999 bg-white/60 backdrop-blur-sm flex items-center justify-center">
      <IFriendSpinner size={96} className="drop-shadow-xl" alt="Loading..." />
    </div>
  );
}
