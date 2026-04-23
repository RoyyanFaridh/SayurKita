import tensorflow as tf
import datetime

class TensorBoardLogger:
    """Mencatat metrik ke TensorBoard"""
    
    def __init__(self, log_dir="logs/fit"):
        self.log_dir = log_dir + "/" + datetime.datetime.now().strftime("%Y%m%d-%H%M%S")
        self.writer = tf.summary.create_file_writer(self.log_dir)
        print(f"📊 TensorBoard log: {self.log_dir}")
    
    def log_scalar(self, name, value, step):
        with self.writer.as_default():
            tf.summary.scalar(name, value, step=step)
            self.writer.flush()
    
    def log_histogram(self, name, values, step):
        with self.writer.as_default():
            tf.summary.histogram(name, values, step=step)
            self.writer.flush()
    
    def log_text(self, name, text, step):
        with self.writer.as_default():
            tf.summary.text(name, text, step=step)
            self.writer.flush()

if __name__ == "__main__":
    print("TensorBoard Logger siap!")