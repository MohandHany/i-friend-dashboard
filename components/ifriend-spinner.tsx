import Image from "next/image";

interface IFriendSpinnerProps {
  size?: number; // pixel size for width/height
  className?: string;
  alt?: string;
}

export default function IFriendSpinner({ size = 64, className = "", alt = "Loading" }: IFriendSpinnerProps) {
  return (
    <div className={`relative inline-flex items-center justify-center ${className}`} aria-label="loading">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-spin rounded-full w-35 h-35 border-b-2 border-primary-blue"></div>
      <Image
        src="/IFriend.svg"
        alt={alt}
        width={size}
        height={size}
        priority
      />
    </div>
  );
}
