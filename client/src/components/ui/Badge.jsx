const Badge = ({ value, className = ""}) => {
    const baseClasses = 
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium border";

    return (
        <span className={`${baseClasses} ${className}`}>
            {value}
        </span>
    );
};

export default Badge;