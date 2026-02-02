import { botttsNeutral, initials } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface GenerateAvatarProps {
  seed: string;
  className?: string;
  variant: "botttsNeutral" | "initials";
}

export function GenerateAvatar({ seed, className, variant }: GenerateAvatarProps) {
  const avatar = createAvatar(
    variant === "botttsNeutral" ? botttsNeutral : initials,
    variant === "botttsNeutral"
      ? { seed }
      : { seed, fontWeight: 500, fontSize: 42 }
  );

  return (
    <Avatar className={cn(className)}>
      <AvatarImage src={avatar.toDataUri()} alt="Avatar" />
      <AvatarFallback>{seed.charAt(0).toUpperCase()}</AvatarFallback>
    </Avatar>
  );
}
