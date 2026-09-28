const unauthorized = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-text">
                    Unauthorized
                </h1>

                <p className="text-text-muted mt-2">
                    You do not have permission to access this page
                </p>

            </div>
        </div>
    );
};

export default unauthorized;