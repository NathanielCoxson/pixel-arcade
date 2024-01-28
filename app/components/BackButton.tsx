import Link from "next/link";

export default function BackButton() {
    return (
        <Link href='/' className="flex items-center justify-center absolute top-8 left-8 font-semibold">
            <div className="w-5 h-5 border-4 border-black border-r-transparent border-t-transparent rotate-45"></div>
            <h2>Back</h2>
        </Link>
    )
}