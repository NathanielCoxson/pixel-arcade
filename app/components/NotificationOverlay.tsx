import Image from "next/image";
export default function NotificationOverlay(props: any) {
    const { src, visible } = props;
    return (
        <>
            {visible && <div className="absolute flex flex-col items-center justify-center z-10 min-w-game-width min-h-game-height">
                <div className="absolute w-3/4 h-1/4 z-20 flex justify-center items-center">
                    <Image
                        src={src}
                        fill={true}
                        className="object-contain"
                        priority={true}
                        onContextMenu={(e) => e.preventDefault()}
                        draggable={false}
                        alt="Game won notification"
                    />
                </div>
            </div>}
        </>
    )
}