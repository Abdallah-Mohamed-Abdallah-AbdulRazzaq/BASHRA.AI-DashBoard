"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { API_BASE_URL } from "@/lib/api";

interface UserAvatarProps {
  user: any;
  className?: string;
}

export const UserAvatar = ({ user, className }: UserAvatarProps) => {
  const [hasError, setHasError] = useState(false);

  // Extract the URL robustly
  let rawUrl = null;
  if (user?.profile?.profile_picture_url) rawUrl = user.profile.profile_picture_url;
  else if (user?.profile_picture_url) rawUrl = user.profile_picture_url;
  else if (user?.user?.profile?.profile_picture_url) rawUrl = user.user.profile.profile_picture_url;
  else if (user?.user?.profile_picture_url) rawUrl = user.user.profile_picture_url;
  else if (user?.patient_profile?.profile_picture_url) rawUrl = user.patient_profile.profile_picture_url;

  let src = null;
  if (rawUrl) {
    if (rawUrl.startsWith("http")) {
      src = rawUrl;
    } else {
      src = `${API_BASE_URL}${rawUrl.startsWith("/") ? "" : "/"}${rawUrl}`;
    }
  }

  // Fallback placeholder image
  const defaultImage = "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop";

  // If we have a URL and it hasn't errored out, show it
  if (src && !hasError) {
    return (
      <div className={cn("relative w-full h-full", className)}>
        <Image
          src={src}
          alt="User Avatar"
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 100px"
          onError={() => setHasError(true)}
          unoptimized={false} // Force Next.js to proxy and optimize the image (bypasses CORS)
        />
      </div>
    );
  }

  // Fallback
  return (
    <div className={cn("relative w-full h-full", className)}>
      <Image
        src={defaultImage}
        alt="User Avatar Placeholder"
        fill
        className="object-cover opacity-70"
        sizes="(max-width: 768px) 100vw, 100px"
        unoptimized={true}
      />
    </div>
  );
};
