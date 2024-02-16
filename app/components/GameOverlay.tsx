export default function GameOverlay({ visible, children }: { visible: boolean, children: React.ReactNode }) {
    return (
        <>
            {visible && <div className="absolute w-full h-full flex justify-center items-center z-50">
                {children}
            </div>}
        </>
    )
}