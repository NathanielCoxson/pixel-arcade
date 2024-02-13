import Image from "next/image";
export default function NotificationOverlay(props: any) {
    const { src, visible } = props;
    return (
        <>
            {visible && <div className="absolute w-full h-full flex justify-center items-center">
                <div className="absolute w-3/4 h-1/4 z-50 flex justify-center items-center">
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