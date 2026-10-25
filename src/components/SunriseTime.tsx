import { useEffect, useRef, useState } from "react";
import { Sunrise } from "lucide-react";
import { defaultSunriseCoordinates, sunriseTime, type Coordinates } from "@/lib/sunrise";
import type { CivilDate } from "@/lib/tamil-calendar";

type SunriseTimeProps = {
  date: CivilDate;
};

export function SunriseTime({ date }: SunriseTimeProps) {
  const [coordinates, setCoordinates] = useState<Coordinates>(defaultSunriseCoordinates);
  const [locationName, setLocationName] = useState("சென்னை");
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState("");
  const locationRequested = useRef(false);
  const sunrise = sunriseTime(date, coordinates);

  useEffect(() => {
    if (locationRequested.current) return;
    locationRequested.current = true;

    if (!navigator.geolocation) {
      setLocationError("இருப்பிட வசதி இல்லை. சென்னை நேரம் காட்டப்படுகிறது.");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setCoordinates({ latitude: coords.latitude, longitude: coords.longitude });
        setLocationName("உங்கள் இருப்பிடம்");
        setIsLocating(false);
      },
      (error) => {
        setLocationError(
          error.code === error.PERMISSION_DENIED
            ? "இருப்பிட அனுமதி இல்லை. சென்னை நேரம் காட்டப்படுகிறது."
            : "இருப்பிடத்தைப் பெற முடியவில்லை. சென்னை நேரம் காட்டப்படுகிறது.",
        );
        setIsLocating(false);
      },
      { maximumAge: 300000, timeout: 10000 },
    );
  }, []);

  return (
    <div className="flex min-w-0 flex-col items-center gap-2 border-t-2 border-border pt-4 text-center sm:items-start sm:border-l-2 sm:border-t-0 sm:pl-5 sm:pt-0 sm:text-left">
      <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground">
        <Sunrise className="size-4" />
        சூரிய உதயம்
      </div>
      {sunrise ? (
        <div className="font-display text-2xl font-bold">
          காலை {sunrise.toLocaleTimeString("ta-IN", { hour: "numeric", minute: "2-digit", hourCycle: "h23" })}
        </div>
      ) : (
        <div className="text-sm font-bold">இன்று சூரிய உதயம் இல்லை</div>
      )}
      <div className="text-sm text-muted-foreground">{locationName}</div>
      {isLocating && <p className="text-xs text-muted-foreground">இருப்பிடத்தைப் பெறுகிறது…</p>}
      {locationError && (
        <p role="status" className="max-w-48 text-xs text-destructive">{locationError}</p>
      )}
    </div>
  );
}
