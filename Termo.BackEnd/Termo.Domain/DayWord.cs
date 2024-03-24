namespace Termo.Domain {
    public class DayWord {
        public Guid Id { get; set; }
        public string? Value { get; set; }
        public DateTime Day { get; set; }
        public bool Used { get; set; }
        public bool Success { get; set; }
    }
}
